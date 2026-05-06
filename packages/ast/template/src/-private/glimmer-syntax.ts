import {
  type AST,
  builders,
  type NodeVisitor,
  print as upstreamPrint,
  traverse as upstreamTraverse,
} from '@glimmer/syntax';

import { type NodeInfo, Parser } from './glimmer-syntax/parser.js';

const NODE_INFO = new WeakMap<AST.Node, NodeInfo>();

export function parse(template: string): AST.Template {
  return new Parser(template, NODE_INFO).ast;
}

export function print(ast: AST.Node): string {
  return upstreamPrint(ast, {
    entityEncoding: 'raw',
    // @ts-expect-error: Incorrect type
    override: (ast) => {
      const info = NODE_INFO.get(ast);

      if (info) {
        return info.parse_result.print(ast);
      }
    },
  });
}

export function traverse() {
  return function (file: string, visitMethods: NodeVisitor = {}): AST.Template {
    const { ast } = new Parser(file, NODE_INFO);

    upstreamTraverse(ast, visitMethods);

    return ast;
  };
}

export { builders };
