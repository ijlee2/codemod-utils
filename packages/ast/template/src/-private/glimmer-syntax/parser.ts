import {
  type AST,
  builders,
  preprocess,
  print as _print,
  traverse,
} from '@glimmer/syntax';

import { getLines, sortByLoc, sourceForLoc } from './utils.js';

type QuoteType = '"' | "'";

interface AnnotatedAttrNode extends AST.AttrNode {
  /**
   * Supports cases like `<input disabled>` or `<div ...attributes>`
   */
  isValueless?: boolean;

  /**
   * TextNode values can use single, double, or no quotes
   * `type=input` vs `type='input'` vs `type="input"`
   * ConcatStatement values can use single or double quotes
   * `class='thing {{get this classNames}}'` vs `class="thing {{get this classNames}}"`
   * MustacheStatements never use quotes
   */
  quoteType?: QuoteType | null;
}

interface AnnotatedStringLiteral extends AST.StringLiteral {
  quoteType?: QuoteType;
}

/**
 * The glimmer printer doesn't have any formatting suppport. It always uses
 * double quotes, and won't print attrs without a value. To choose quote types
 * or omit the value, we have to do it ourselves.
 */
function useCustomPrinter(node: AST.BaseNode): boolean {
  switch (node.type) {
    case 'AttrNode': {
      const n = node as AnnotatedAttrNode;
      return Boolean(n.isValueless) || n.quoteType !== undefined;
    }

    case 'StringLiteral': {
      return Boolean((node as AnnotatedStringLiteral).quoteType);
    }

    default: {
      return false;
    }
  }
}

const leadingWhitespace = /(^\s+)/;
const attrNodeParts = /(^[^=]+)(\s+)?(=)?(\s+)?(['"])?(\S+)?/;
const hashPairParts = /(^[^=]+)(\s+)?=(\s+)?(\S+)/;
const invalidUnquotedAttrValue = /[^-.a-zA-Z0-9]/;

const voidTagNames = new Set([
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

/*
  This is needed to address issues in the glimmer-vm AST _before_ any of the nodes and node
  values are cached. The specific issues being worked around are:

  * https://github.com/glimmerjs/glimmer-vm/pull/953
  * https://github.com/glimmerjs/glimmer-vm/pull/954
*/
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
function fixASTIssues(sourceLines: any, ast: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  traverse(ast, {
    AttrNode(attr: AST.AttrNode) {
      const node = attr as AnnotatedAttrNode;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const source = sourceForLoc(sourceLines, node.loc);
      const attrNodePartsResults = source.match(attrNodeParts);
      if (attrNodePartsResults === null) {
        throw new Error(`Could not match attr node parts for ${source}`);
      }
      const [, , , equals, , quote] = attrNodePartsResults;
      const isValueless = !equals;

      // TODO: manually working around https://github.com/glimmerjs/glimmer-vm/pull/953
      if (
        isValueless &&
        node.value.type === 'TextNode' &&
        node.value.chars === ''
      ) {
        // \n is not valid within an attribute name (it would indicate two attributes)
        // always assume the attribute ends on the starting line
        const {
          start: { line, column },
        } = node.loc;
        node.loc = builders.loc(line, column, line, column + node.name.length);
      }

      node.isValueless = isValueless;
      node.quoteType = (quote as QuoteType) || null;
    },

    StringLiteral(lit) {
      const quotes = /^['"]/;
      const node = lit as AnnotatedStringLiteral;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const source = sourceForLoc(sourceLines, node.loc);
      if (!source.match(quotes)) {
        throw new Error('Invalid string literal found');
      }
      node.quoteType = source[0] as QuoteType;
    },

    TextNode(node, path) {
      if (path.parentNode === null) {
        throw new Error(
          'ember-template-recast: Error while sanitizing input AST: found TextNode with no parentNode',
        );
      }

      switch (path.parentNode.type) {
        case 'AttrNode': {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const source = sourceForLoc(sourceLines, node.loc);
          if (
            node.chars.length > 0 &&
            ((source.startsWith(`'`) && source.endsWith(`'`)) ||
              (source.startsWith(`"`) && source.endsWith(`"`)))
          ) {
            const { start, end } = node.loc;
            node.loc = builders.loc(
              start.line,
              start.column + 1,
              end.line,
              end.column - 1,
            );
          }
          break;
        }
        case 'ConcatStatement': {
          const parent = path.parentNode;
          const isFirstPart = parent.parts.indexOf(node) === 0;

          const { start, end } = node.loc;
          if (
            isFirstPart &&
            node.loc.start.column > path.parentNode.loc.start.column + 1
          ) {
            // TODO: manually working around https://github.com/glimmerjs/glimmer-vm/pull/954
            node.loc = builders.loc(
              start.line,
              start.column - 1,
              end.line,
              end.column,
            );
          } else if (isFirstPart && node.chars.charAt(0) === '\n') {
            node.loc = builders.loc(
              start.line,
              start.column + 1,
              end.line,
              end.column,
            );
          }
        }
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return ast;
}

export interface NodeInfo {
  hadHash?: boolean;
  hadParams?: boolean;
  hashSource?: string;
  node: AST.Node;
  original: AST.Node;
  paramsSource?: string;
  parse_result: Parser;
  postHashWhitespace?: string;
  postParamsWhitespace?: string;
  postPathWhitespace?: string;
  source: string;
}

export class Parser {
  private _originalAst: AST.Template;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ancestor = new Map<any, any>();
  public ast: AST.Template;
  private dirtyFields = new Map<AST.Node, Set<string>>();
  private nodeInfo: WeakMap<AST.Node, NodeInfo>;
  private source: string[];

  constructor(
    template: string,
    nodeInfo: WeakMap<AST.Node, NodeInfo> = new WeakMap(),
  ) {
    let ast = preprocess(template, {
      mode: 'codemod',
    });

    const source = getLines(template);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ast = fixASTIssues(source, ast);
    this.source = source;
    this._originalAst = ast;

    this.nodeInfo = nodeInfo;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.ast = this.wrapNode(null, ast);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private _rebuildParamsHash(
    ast:
      | AST.MustacheStatement
      | AST.SubExpression
      | AST.ElementModifierStatement
      | AST.BlockStatement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodeInfo: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dirtyFields: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { original } = nodeInfo;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (dirtyFields.has('hash')) {
      if (ast.hash.pairs.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        nodeInfo.hashSource = '';

        if (ast.params.length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          nodeInfo.postPathWhitespace = '';
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          nodeInfo.postParamsWhitespace = '';
        }
      } else {
        let joinWith;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (original.hash.pairs.length > 1) {
          joinWith = this.sourceForLoc({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            start: original.hash.pairs[0].loc.end,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            end: original.hash.pairs[1].loc.start,
          });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        } else if (nodeInfo.hadParams) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          joinWith = nodeInfo.postPathWhitespace;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        } else if (nodeInfo.hadHash) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          joinWith = nodeInfo.postParamsWhitespace;
        } else {
          joinWith = ' ';
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        if (joinWith.trim() !== '') {
          // if the autodetection above resulted in some non whitespace
          // values, reset to `' '`
          joinWith = ' ';
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        nodeInfo.hashSource = ast.hash.pairs
          .map((pair: AST.HashPair) => {
            return this.print(pair);
          })
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          .join(joinWith);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!nodeInfo.hadHash) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          nodeInfo.postParamsWhitespace = joinWith;
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      dirtyFields.delete('hash');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (dirtyFields.has('params')) {
      let joinWith;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (original.params.length > 1) {
        joinWith = this.sourceForLoc({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          start: original.params[0].loc.end,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          end: original.params[1].loc.start,
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (nodeInfo.hadParams) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        joinWith = nodeInfo.postPathWhitespace;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (nodeInfo.hadHash) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        joinWith = nodeInfo.postParamsWhitespace;
      } else {
        joinWith = ' ';
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (joinWith.trim() !== '') {
        // if the autodetection above resulted in some non whitespace
        // values, reset to `' '`
        joinWith = ' ';
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      nodeInfo.paramsSource = ast.params
        .map((param) => this.print(param))
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .join(joinWith);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (nodeInfo.hadParams && ast.params.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        nodeInfo.postPathWhitespace = '';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      } else if (!nodeInfo.hadParams && ast.params.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        nodeInfo.postPathWhitespace = joinWith;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      dirtyFields.delete('params');
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
  private _updateNodeInfoForParamsHash(_ast: any, nodeInfo: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { original } = nodeInfo;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const hadParams = (nodeInfo.hadParams = original.params.length > 0);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const hadHash = (nodeInfo.hadHash = original.hash.pairs.length > 0);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    nodeInfo.postPathWhitespace = hadParams
      ? this.sourceForLoc({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          start: original.path.loc.end,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          end: original.params[0].loc.start,
        })
      : '';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    nodeInfo.paramsSource = hadParams
      ? this.sourceForLoc({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          start: original.params[0].loc.start,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          end: original.params[original.params.length - 1].loc.end,
        })
      : '';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    nodeInfo.postParamsWhitespace = hadHash
      ? this.sourceForLoc({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          start: hadParams
            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              original.params[original.params.length - 1].loc.end
            : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              original.path.loc.end,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          end: original.hash.loc.start,
        })
      : '';

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    nodeInfo.hashSource = hadHash ? this.sourceForLoc(original.hash.loc) : '';

    const postHashSource = this.sourceForLoc({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      start: hadHash
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          original.hash.loc.end
        : hadParams
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            original.params[original.params.length - 1].loc.end
          : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            original.path.loc.end,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      end: original.loc.end,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    nodeInfo.postHashWhitespace = '';
    const postHashWhitespaceMatch = postHashSource.match(leadingWhitespace);
    if (postHashWhitespaceMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      nodeInfo.postHashWhitespace = postHashWhitespaceMatch[0];
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
  private markAsDirty(node: any, property: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    let dirtyFields = this.dirtyFields.get(node);
    if (dirtyFields === undefined) {
      dirtyFields = new Set();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.dirtyFields.set(node, dirtyFields);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    dirtyFields.add(property);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ancestor = this.ancestor.get(node);
    if (ancestor !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.markAsDirty(ancestor.node, ancestor.key);
    }
  }

  print(_ast: AST.Node = this._originalAst): string {
    if (!_ast) {
      return '';
    }

    const nodeInfo = this.nodeInfo.get(_ast);

    if (nodeInfo === undefined) {
      return this.printUserSuppliedNode(_ast);
    }

    // this ensures that we are operating on the actual node and not a
    // proxy (we can get Proxies here when transforms splice body/children)
    const ast = nodeInfo.node;

    // make a copy of the dirtyFields, so we can easily track
    // unhandled dirtied fields
    const dirtyFields = new Set(this.dirtyFields.get(ast));
    if (dirtyFields.size === 0 && nodeInfo !== undefined) {
      return nodeInfo.source;
    }

    // TODO: splice the original source **excluding** "children"
    // based on dirtyFields
    const output = [];

    const { original } = nodeInfo;

    switch (ast.type) {
      // @ts-expect-error: Incorrect type
      case 'Program':
      case 'Block':
      case 'Template':
        {
          let bodySource = nodeInfo.source;

          if (dirtyFields.has('body')) {
            bodySource = ast.body.map((node) => this.print(node)).join('');

            dirtyFields.delete('body');
          }

          output.push(bodySource);
        }
        break;
      case 'ElementNode':
        {
          const element = original as AST.ElementNode;
          const { selfClosing, children } = element;
          const hadChildren = children.length > 0;
          const hadBlockParams = element.blockParams.length > 0;

          let openSource = `<${element.tag}`;

          const originalOpenParts = [
            ...element.attributes,
            ...element.modifiers,
            ...element.comments,
          ].sort(sortByLoc);

          let postTagWhitespace;
          if (originalOpenParts.length > 0) {
            postTagWhitespace = this.sourceForLoc({
              start: {
                line: element.loc.start.line,
                column:
                  element.loc.start.column + 1 /* < */ + element.tag.length,
              },
              // @ts-expect-error: Incorrect type
              end: originalOpenParts[0].loc.start,
            });
          } else if (selfClosing) {
            postTagWhitespace = nodeInfo.source.substring(
              openSource.length,
              nodeInfo.source.length - 2,
            );
          } else {
            postTagWhitespace = '';
          }

          let openPartsSource = originalOpenParts.reduce(
            (acc, part, index, parts) => {
              const partSource = this.sourceForLoc(part.loc);

              if (index === parts.length - 1) {
                return acc + partSource;
              }

              let joinPartWith = this.sourceForLoc({
                // @ts-expect-error: Incorrect type
                start: parts[index].loc.end,
                // @ts-expect-error: Incorrect type
                end: parts[index + 1].loc.start,
              });

              if (joinPartWith.trim() !== '') {
                // if the autodetection above resulted in some non whitespace
                // values, reset to `' '`
                joinPartWith = ' ';
              }

              return acc + partSource + joinPartWith;
            },
            '',
          );

          let postPartsWhitespace = '';
          if (originalOpenParts.length > 0) {
            const postPartsSource = this.sourceForLoc({
              // @ts-expect-error: Incorrect type
              start: originalOpenParts[originalOpenParts.length - 1].loc.end,
              end: hadChildren
                ? // @ts-expect-error: Incorrect type
                  element.children[0].loc.start
                : element.loc.end,
            });

            const matchedWhitespace = postPartsSource.match(leadingWhitespace);
            if (matchedWhitespace) {
              postPartsWhitespace = matchedWhitespace[0];
            }
          } else if (hadBlockParams) {
            const postPartsSource = this.sourceForLoc({
              start: {
                line: element.loc.start.line,
                column: element.loc.start.column + 1 + element.tag.length,
              },
              end: hadChildren
                ? // @ts-expect-error: Incorrect type
                  element.children[0].loc.start
                : element.loc.end,
            });

            const matchedWhitespace = postPartsSource.match(leadingWhitespace);
            if (matchedWhitespace) {
              postPartsWhitespace = matchedWhitespace[0];
            }
          }

          let blockParamsSource = '';
          let postBlockParamsWhitespace = '';
          if (element.blockParams.length > 0) {
            const blockParamStartIndex = nodeInfo.source.indexOf('as |');
            const blockParamsEndIndex = nodeInfo.source.indexOf(
              '|',
              blockParamStartIndex + 4,
            );
            blockParamsSource = nodeInfo.source.substring(
              blockParamStartIndex,
              blockParamsEndIndex + 1,
            );

            // Match closing index after start of block params to avoid closing tag if /> or > encountered in string
            const closeOpenIndex =
              nodeInfo.source
                .substring(blockParamStartIndex)
                .indexOf(selfClosing ? '/>' : '>') + blockParamStartIndex;
            postBlockParamsWhitespace = nodeInfo.source.substring(
              blockParamsEndIndex + 1,
              closeOpenIndex,
            );
          }

          let closeOpen = selfClosing ? `/>` : `>`;

          let childrenSource = hadChildren
            ? this.sourceForLoc({
                // @ts-expect-error: Incorrect type
                start: element.children[0].loc.start,
                // @ts-expect-error: Incorrect type
                end: element.children[children.length - 1].loc.end,
              })
            : '';

          let closeSource = selfClosing
            ? ''
            : voidTagNames.has(element.tag)
              ? ''
              : `</${element.tag}>`;

          if (dirtyFields.has('tag')) {
            openSource = `<${ast.tag}`;

            closeSource = selfClosing
              ? ''
              : voidTagNames.has(ast.tag)
                ? ''
                : `</${ast.tag}>`;

            dirtyFields.delete('tag');
          }

          if (dirtyFields.has('children')) {
            childrenSource = ast.children
              .map((child) => this.print(child))
              .join('');

            if (selfClosing) {
              closeOpen = `>`;
              closeSource = `</${ast.tag}>`;
              ast.selfClosing = false;

              if (originalOpenParts.length === 0 && postTagWhitespace === ' ') {
                postTagWhitespace = '';
              }

              if (originalOpenParts.length > 0 && postPartsWhitespace === ' ') {
                postPartsWhitespace = '';
              }
            }

            dirtyFields.delete('children');
          }

          if (
            dirtyFields.has('attributes') ||
            dirtyFields.has('comments') ||
            dirtyFields.has('modifiers')
          ) {
            const openParts = [
              ...ast.attributes,
              ...ast.modifiers,
              ...ast.comments,
            ].sort(sortByLoc);

            openPartsSource = openParts.reduce((acc, part, index, parts) => {
              const partSource = this.print(part);

              if (index === parts.length - 1) {
                return acc + partSource;
              }

              let joinPartWith = this.sourceForLoc({
                // @ts-expect-error: Incorrect type
                start: parts[index].loc.end,
                // @ts-expect-error: Incorrect type
                end: parts[index + 1].loc.start,
              });

              if (joinPartWith === '' || joinPartWith.trim() !== '') {
                // if the autodetection above resulted in some non whitespace
                // values, reset to `' '`
                joinPartWith = ' ';
              }

              return acc + partSource + joinPartWith;
            }, '');

            if (originalOpenParts.length === 0) {
              postTagWhitespace = ' ';
            }

            if (openParts.length === 0 && originalOpenParts.length > 0) {
              postTagWhitespace = '';
            }

            if (openParts.length > 0 && ast.selfClosing) {
              postPartsWhitespace = postPartsWhitespace || ' ';
            }

            dirtyFields.delete('attributes');
            dirtyFields.delete('comments');
            dirtyFields.delete('modifiers');
          }

          if (dirtyFields.has('blockParams')) {
            if (ast.blockParams.length === 0) {
              blockParamsSource = '';
              postPartsWhitespace = '';
            } else {
              blockParamsSource = `as |${ast.blockParams.join(' ')}|`;

              // ensure we have at least a space
              postPartsWhitespace = postPartsWhitespace || ' ';
            }

            dirtyFields.delete('blockParams');
          }

          output.push(
            openSource,
            postTagWhitespace,
            openPartsSource,
            postPartsWhitespace,
            blockParamsSource,
            postBlockParamsWhitespace,
            closeOpen,
            childrenSource,
            closeSource,
          );
        }
        break;
      case 'MustacheStatement':
      case 'ElementModifierStatement':
      case 'SubExpression':
        {
          this._updateNodeInfoForParamsHash(ast, nodeInfo);

          let openSource = this.sourceForLoc({
            start: original.loc.start,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            end: (original as any).path.loc.end,
          });

          let endSource = this.sourceForLoc({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            start: nodeInfo.hadHash
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                (original as any).hash.loc.end
              : nodeInfo.hadParams
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                  (original as any).params[(original as any).params.length - 1]
                    .loc.end
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                  (original as any).path.loc.end,
            end: original.loc.end,
          }).trimLeft();

          if (dirtyFields.has('path')) {
            openSource =
              this.sourceForLoc({
                start: original.loc.start,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                end: (original as any).path.loc.start,
              }) + this.print(ast.path);

            dirtyFields.delete('path');
          }

          if (dirtyFields.has('type')) {
            // we only support going from SubExpression -> MustacheStatement
            if (
              original.type !== 'SubExpression' ||
              ast.type !== 'MustacheStatement'
            ) {
              throw new Error(
                `ember-template-recast only supports updating the 'type' for SubExpression to MustacheStatement (you attempted to change ${original.type} to ${ast.type})`,
              );
            }

            // TODO: this is a logic error, assumes ast.path is a PathExpression but it could be a number of other things
            openSource = `{{${(ast.path as AST.PathExpression).original}`;
            endSource = '}}';

            dirtyFields.delete('type');
          }

          this._rebuildParamsHash(ast, nodeInfo, dirtyFields);

          output.push(
            openSource,
            nodeInfo.postPathWhitespace,
            nodeInfo.paramsSource,
            nodeInfo.postParamsWhitespace,
            nodeInfo.hashSource,
            nodeInfo.postHashWhitespace,
            endSource,
          );
        }
        break;
      case 'ConcatStatement':
        {
          let partsSource = this.sourceForLoc({
            start: {
              line: original.loc.start.line,
              column: original.loc.start.column + 1,
            },

            end: {
              line: original.loc.end.line,
              column: original.loc.end.column - 1,
            },
          });

          if (dirtyFields.has('parts')) {
            partsSource = ast.parts.map((part) => this.print(part)).join('');

            dirtyFields.delete('parts');
          }

          output.push(partsSource);
        }
        break;
      case 'BlockStatement':
        {
          const block = original as AST.BlockStatement;

          this._updateNodeInfoForParamsHash(ast, nodeInfo);

          const hadProgram = block.program.body.length > 0;
          const hadProgramBlockParams = block.program.blockParams.length > 0;

          let openSource = this.sourceForLoc({
            start: block.loc.start,
            end: block.path.loc.end,
          });

          let blockParamsSource = '';
          let postBlockParamsWhitespace = '';
          if (hadProgramBlockParams) {
            const blockParamsSourceScratch = this.sourceForLoc({
              start: nodeInfo.hadHash
                ? block.hash.loc.end
                : nodeInfo.hadParams
                  ? // @ts-expect-error: Incorrect type
                    block.params[block.params.length - 1].loc.end
                  : block.path.loc.end,
              end: original.loc.end,
            });

            const indexOfAsPipe = blockParamsSourceScratch.indexOf('as |');
            const indexOfEndPipe = blockParamsSourceScratch.indexOf(
              '|',
              indexOfAsPipe + 4,
            );

            blockParamsSource = blockParamsSourceScratch.substring(
              indexOfAsPipe,
              indexOfEndPipe + 1,
            );

            const postBlockParamsWhitespaceMatch = blockParamsSourceScratch
              .substring(indexOfEndPipe + 1)
              .match(leadingWhitespace);
            if (postBlockParamsWhitespaceMatch) {
              postBlockParamsWhitespace = postBlockParamsWhitespaceMatch[0];
            }
          }

          let openEndSource;
          {
            const openEndSourceScratch = this.sourceForLoc({
              start: nodeInfo.hadHash
                ? block.hash.loc.end
                : nodeInfo.hadParams
                  ? // @ts-expect-error: Incorrect type
                    block.params[block.params.length - 1].loc.end
                  : block.path.loc.end,
              end: block.loc.end,
            });

            let startingOffset = 0;
            if (hadProgramBlockParams) {
              const indexOfAsPipe = openEndSourceScratch.indexOf('as |');
              const indexOfEndPipe = openEndSourceScratch.indexOf(
                '|',
                indexOfAsPipe + 4,
              );

              startingOffset = indexOfEndPipe + 1;
            }

            const indexOfFirstCurly = openEndSourceScratch.indexOf('}');
            const indexOfSecondCurly = openEndSourceScratch.indexOf(
              '}',
              indexOfFirstCurly + 1,
            );

            openEndSource = openEndSourceScratch
              .substring(startingOffset, indexOfSecondCurly + 1)
              .trimLeft();
          }

          let programSource = hadProgram
            ? this.sourceForLoc(block.program.loc)
            : '';

          let inversePreamble = '';
          if (block.inverse) {
            if (hadProgram) {
              inversePreamble = this.sourceForLoc({
                start: block.program.loc.end,
                end: block.inverse.loc.start,
              });
            } else {
              const openEndSourceScratch = this.sourceForLoc({
                start: nodeInfo.hadHash
                  ? block.hash.loc.end
                  : nodeInfo.hadParams
                    ? // @ts-expect-error: Incorrect type
                      block.params[block.params.length - 1].loc.end
                    : block.path.loc.end,
                end: block.loc.end,
              });

              const indexOfFirstCurly = openEndSourceScratch.indexOf('}');
              const indexOfSecondCurly = openEndSourceScratch.indexOf(
                '}',
                indexOfFirstCurly + 1,
              );
              const indexOfThirdCurly = openEndSourceScratch.indexOf(
                '}',
                indexOfSecondCurly + 1,
              );
              const indexOfFourthCurly = openEndSourceScratch.indexOf(
                '}',
                indexOfThirdCurly + 1,
              );

              inversePreamble = openEndSourceScratch.substring(
                indexOfSecondCurly + 1,
                indexOfFourthCurly + 1,
              );
            }
          }

          // GH #149
          // In the event we're dealing with a chain of if/else-if/else, the inverse
          // should encompass the entirety of the chain. Sadly, the loc param of
          // original.inverse in this case only captures the block of the first inverse
          // not the entire chain. We instead look at the loc param of the nested body
          // node, which does report the entire chain.
          // In this case, because it also includes the preamble, we must also trim
          // that from our final inverse source.
          let inverseSource;
          if (block.inverse && block.inverse.chained) {
            // @ts-expect-error: Incorrect type
            inverseSource = this.sourceForLoc(block.inverse.body[0].loc) || '';
            inverseSource = inverseSource.slice(inversePreamble.length);
          } else {
            inverseSource = block.inverse
              ? this.sourceForLoc(block.inverse.loc)
              : '';
          }

          let endSource = '';
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          if (!(ast as any).wasChained) {
            const firstOpenCurlyFromEndIndex = nodeInfo.source.lastIndexOf('{');
            const secondOpenCurlyFromEndIndex = nodeInfo.source.lastIndexOf(
              '{',
              firstOpenCurlyFromEndIndex - 1,
            );

            endSource = nodeInfo.source.substring(secondOpenCurlyFromEndIndex);
          }

          this._rebuildParamsHash(ast, nodeInfo, dirtyFields);

          if (dirtyFields.has('path')) {
            openSource =
              this.sourceForLoc({
                start: original.loc.start,
                end: block.path.loc.start,
              }) + _print(ast.path);

            // TODO: this is a logic error
            const pathIndex = endSource.indexOf(
              (block.path as AST.PathExpression).original,
            );
            endSource =
              endSource.slice(0, pathIndex) +
              (ast.path as AST.PathExpression).original +
              endSource.slice(
                pathIndex + (block.path as AST.PathExpression).original.length,
              );

            dirtyFields.delete('path');
          }

          if (dirtyFields.has('program')) {
            const programDirtyFields = new Set(
              this.dirtyFields.get(ast.program),
            );

            if (programDirtyFields.has('blockParams')) {
              if (ast.program.blockParams.length === 0) {
                nodeInfo.postHashWhitespace = '';
                blockParamsSource = '';
              } else {
                nodeInfo.postHashWhitespace =
                  nodeInfo.postHashWhitespace || ' ';
                blockParamsSource = `as |${ast.program.blockParams.join(' ')}|`;
              }
              programDirtyFields.delete('blockParams');
            }

            if (programDirtyFields.has('body')) {
              programSource = ast.program.body
                .map((child) => this.print(child))
                .join('');

              programDirtyFields.delete('body');
            }

            if (programDirtyFields.size > 0) {
              throw new Error(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `Unhandled mutations for ${ast.program.type}: ${Array.from(programDirtyFields)}`,
              );
            }

            dirtyFields.delete('program');
          }

          if (dirtyFields.has('inverse')) {
            if (!ast.inverse) {
              inverseSource = '';
              inversePreamble = '';
            } else {
              if (ast.inverse.chained) {
                inversePreamble = '';
                const inverseBody = ast.inverse.body[0];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                (inverseBody as any).wasChained = true;
                inverseSource = this.print(inverseBody);
              } else {
                inverseSource = ast.inverse.body
                  .map((child) => this.print(child))
                  .join('');
              }

              if (!block.inverse) {
                // TODO: detect {{else}} vs {{else if foo}}
                inversePreamble = '{{else}}';
              }
            }

            dirtyFields.delete('inverse');
          }

          output.push(
            openSource,
            nodeInfo.postPathWhitespace,
            nodeInfo.paramsSource,
            nodeInfo.postParamsWhitespace,
            nodeInfo.hashSource,
            nodeInfo.postHashWhitespace,
            blockParamsSource,
            postBlockParamsWhitespace,
            openEndSource,
            programSource,
            inversePreamble,
            inverseSource,
            endSource,
          );
        }
        break;
      case 'HashPair':
        {
          const hashPair = original as AST.HashPair;
          const { source } = nodeInfo;
          const hashPairPartsResult = source.match(hashPairParts);
          if (hashPairPartsResult === null) {
            throw new Error('Could not match hash pair parts');
          }
          // eslint-disable-next-line prefer-const
          let [, keySource, postKeyWhitespace, postEqualsWhitespace] =
            hashPairPartsResult;
          let valueSource = this.sourceForLoc(hashPair.value.loc);

          if (dirtyFields.has('key')) {
            keySource = ast.key;

            dirtyFields.delete('key');
          }

          if (dirtyFields.has('value')) {
            valueSource = this.print(ast.value);

            dirtyFields.delete('value');
          }

          output.push(
            keySource,
            postKeyWhitespace,
            '=',
            postEqualsWhitespace,
            valueSource,
          );
        }
        break;
      case 'AttrNode':
        {
          const attrNode = original as AST.AttrNode;
          const { source } = nodeInfo;
          const attrNodePartsResults = source.match(attrNodeParts);
          if (attrNodePartsResults === null) {
            throw new Error(`Could not match attr node parts for ${source}`);
          }

          let [
            ,
            nameSource,
            // eslint-disable-next-line prefer-const
            postNameWhitespace,
            equals,
            // eslint-disable-next-line prefer-const
            postEqualsWhitespace,
            quote,
          ] = attrNodePartsResults;
          let valueSource = this.sourceForLoc(attrNode.value.loc);
          // Source of ConcatStatements includes their quotes,
          // but source of an AttrNode's TextNode value does not.
          // Normalize on not including them, then always printing them ourselves:
          if (attrNode.value.type === 'ConcatStatement') {
            valueSource = valueSource.slice(1, -1);
          }

          const node = ast as AnnotatedAttrNode;

          if (dirtyFields.has('name')) {
            nameSource = node.name;
            dirtyFields.delete('name');
          }

          if (dirtyFields.has('quoteType')) {
            // Ensure the quote type they've specified is valid for the value
            if (node.value.type === 'MustacheStatement' && node.quoteType) {
              throw new Error(
                'Mustache statements should not be quoted as attribute values',
              );
            } else if (
              node.value.type === 'ConcatStatement' &&
              !node.quoteType
            ) {
              throw new Error(
                'ConcatStatements must be quoted as attribute values',
              );
            } else if (
              node.value.type == 'TextNode' &&
              !node.quoteType &&
              node.value.chars.match(invalidUnquotedAttrValue)
            ) {
              throw new Error(
                `\`${node.value.chars}\` is invalid as an unquoted attribute value. Alphanumeric, hyphens, and periods only`,
              );
            }
            quote = node.quoteType || ''; // null => empty string
          } else if (dirtyFields.has('value')) {
            // They updated the value without choosing a quote type. We'll use the previous quote
            // type or default to double quote if necessary
            if (node.value.type === 'MustacheStatement') {
              quote = '';
            } else if (
              node.value.type === 'TextNode' &&
              node.quoteType === null &&
              !node.value.chars.match(invalidUnquotedAttrValue)
            ) {
              // If old value was unquoted, and new value is also ok as unquoted, preserve that.
              quote = '';
            } else {
              quote = quote || '"';
            }
          }
          dirtyFields.delete('quoteType');

          if (dirtyFields.has('isValueless')) {
            if (node.isValueless) {
              equals = '';
              quote = '';
              valueSource = '';
              dirtyFields.delete('isValueless');
              dirtyFields.delete('value');
            } else {
              equals = '=';
              if (node.value.type !== 'MustacheStatement' && !quote) {
                quote = '"';
              }
              dirtyFields.delete('isValueless');
            }
          }

          if (dirtyFields.has('value')) {
            equals = '=';
            // If they created a ConcatStatement node, we need to print it ourselves here.
            // Otherwise, since it has no nodeInfo, it will print using the glimmer printer
            // which hardcodes double quotes.
            if (node.value.type === 'ConcatStatement') {
              valueSource = node.value.parts
                .map((part) => this.print(part))
                .join('');
            } else {
              valueSource = this.print(node.value);
            }
          }
          dirtyFields.delete('value');

          output.push(
            nameSource,
            postNameWhitespace,
            equals,
            postEqualsWhitespace,
            quote,
            valueSource,
            quote,
          );
        }
        break;
      case 'PathExpression':
        {
          let { source } = nodeInfo;

          if (dirtyFields.has('original')) {
            source = ast.original;
            dirtyFields.delete('original');
          }

          output.push(source);
        }
        break;
      case 'MustacheCommentStatement':
      case 'CommentStatement':
        {
          const commentStatement = original as AST.CommentStatement;
          const indexOfValue = nodeInfo.source.indexOf(commentStatement.value);
          const openSource = nodeInfo.source.substring(0, indexOfValue);
          let valueSource = commentStatement.value;
          const endSource = nodeInfo.source.substring(
            indexOfValue + valueSource.length,
          );

          if (dirtyFields.has('value')) {
            valueSource = ast.value;

            dirtyFields.delete('value');
          }

          output.push(openSource, valueSource, endSource);
        }
        break;
      case 'TextNode':
        {
          let { source } = nodeInfo;

          if (dirtyFields.has('chars')) {
            source = ast.chars;
            dirtyFields.delete('chars');
          }

          output.push(source);
        }
        break;
      case 'StringLiteral':
        {
          const node = ast as AnnotatedStringLiteral;
          output.push(node.quoteType, node.value, node.quoteType);
        }
        break;
      case 'BooleanLiteral':
      case 'NumberLiteral':
      case 'NullLiteral':
        {
          let { source } = nodeInfo;

          if (dirtyFields.has('value')) {
            source = ast.value?.toString() || '';
            dirtyFields.delete('value');
          }

          output.push(source);
        }
        break;
      default:
        throw new Error(
          `ember-template-recast does not have the ability to update ${original.type}. Please open an issue so we can add support.`,
        );
    }

    for (const field of dirtyFields.values()) {
      if (field in Object.keys(original)) {
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `ember-template-recast could not handle the mutations of \`${Array.from(
            dirtyFields,
          )}\` on ${original.type}`,
        );
      }
    }

    return output.join('');
  }

  // User-created nodes will have no nodeInfo, but we support
  // formatting properties that the glimmer printer does not.
  // If the user-created node specifies no custom formatting,
  // just use the glimmer printer.
  // These overrides could go away if glimmer had a concrete
  // syntax tree type and printer.
  printUserSuppliedNode(_ast: AST.Node): string {
    switch (_ast.type) {
      case 'StringLiteral':
        {
          const quote = (_ast as AnnotatedStringLiteral).quoteType || '"';
          return quote + _ast.value + quote;
        }
        // @ts-expect-error: Incorrect type
        break;
      case 'AttrNode':
        {
          const node = _ast as AnnotatedAttrNode;
          if (node.isValueless) {
            if (node.value.type !== 'TextNode' || node.value.chars !== '') {
              throw new Error(
                'The value property of a valueless attr must be an empty TextNode',
              );
            }
            return node.name;
          }
          if (
            node.isValueless === undefined &&
            node.value.type === 'TextNode' &&
            node.value.chars === ''
          ) {
            return node.name;
          }
          switch (node.value.type) {
            case 'MustacheStatement':
              return node.name + '=' + this.print(node.value);
              // @ts-expect-error: Incorrect type
              break;
            case 'ConcatStatement':
              {
                const value = node.value.parts
                  .map((part) => this.print(part))
                  .join('');
                const quote = node.quoteType || '"';
                return node.name + '=' + quote + value + quote;
              }
              // @ts-expect-error: Incorrect type
              break;
            case 'TextNode':
              {
                if (
                  node.quoteType === null &&
                  node.value.chars.match(invalidUnquotedAttrValue)
                ) {
                  throw new Error(
                    `You specified a quoteless attribute \`${node.value.chars}\`, which is invalid without quotes`,
                  );
                }
                let quote: string;
                if (node.quoteType === null) {
                  quote = '';
                } else {
                  quote = node.quoteType || '"';
                }
                return node.name + '=' + quote + node.value.chars + quote;
              }
              // @ts-expect-error: Incorrect type
              break;
          }
        }
        // @ts-expect-error: Incorrect type
        break;
      default:
        return _print(_ast, {
          entityEncoding: 'raw',
          // @ts-expect-error: Incorrect type
          override: (ast) => {
            if (this.nodeInfo.has(ast) || useCustomPrinter(ast)) {
              return this.print(ast);
            }
          },
        });
    }
  }

  /*
    Used to associate the original source with a given node (while wrapping AST nodes
    in a proxy).
  */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
  private sourceForLoc(loc: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return sourceForLoc(this.source, loc);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
  private wrapNode(ancestor: any, node: any) {
    this.ancestor.set(node, ancestor);

    const nodeInfo = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      node,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      original: JSON.parse(JSON.stringify(node)),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      source: this.sourceForLoc(node.loc),
      parse_result: this,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.nodeInfo.set(node, nodeInfo);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const hasLocInfo = !!node.loc;
    const propertyProxyMap = new Map();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const proxy = new Proxy(node, {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      get: (target, property) => {
        if (propertyProxyMap.has(property)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return propertyProxyMap.get(property);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Reflect.get(target, property);
      },

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      set: (target, property, value) => {
        if (propertyProxyMap.has(property)) {
          propertyProxyMap.set(property, value);
        }

        Reflect.set(target, property, value);

        if (hasLocInfo) {
          this.markAsDirty(node, property);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          this.markAsDirty(ancestor.node, ancestor.key);
        }

        return true;
      },

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      deleteProperty: (target, property) => {
        if (propertyProxyMap.has(property)) {
          propertyProxyMap.delete(property);
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const result = Reflect.deleteProperty(target, property);

        if (hasLocInfo) {
          this.markAsDirty(node, property);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          this.markAsDirty(ancestor.node, ancestor.key);
        }

        return result;
      },
    });

    // this is needed in order to handle splicing of Template.body (which
    // happens when during replacement)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.nodeInfo.set(proxy, nodeInfo);

    for (const key in node) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const value = node[key];

      if (key !== 'loc' && typeof value === 'object' && value !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const propertyProxy = this.wrapNode({ node, key }, value);

        propertyProxyMap.set(key, propertyProxy);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return proxy;
  }
}
