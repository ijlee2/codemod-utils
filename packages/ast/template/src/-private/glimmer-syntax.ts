import {
  type AST,
  builders,
  type NodeVisitor,
  print as upstreamPrint,
  traverse,
  Walker,
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

type TransformOptions = {
  /**
   * The path (relative to the current working directory) to the file being transformed.
   *
   * This is useful when a given transform need to have differing behavior based on the
   * location of the file (e.g. a component template should be modified differently than
   * a route template).
   */
  filePath?: string;

  /**
   * The plugin to use for transformation.
   */
  plugin: TransformPluginBuilder;

  /**
   * The template to transform (either as a string or a pre-parsed AST.Template).
   */
  template: string | AST.Template;
};

type TransformPluginBuilder = {
  (env: TransformPluginEnv): NodeVisitor;
};

type TransformPluginEnv = {
  contents: string;
  filePath: string | undefined;
  parseOptions: {
    srcName: string | undefined;
  };
  syntax: {
    Walker: typeof Walker;
    builders: typeof builders;
    parse: typeof parse;
    print: typeof print;
    traverse: typeof traverse;
  };
};

type TransformResult = {
  ast: AST.Template;
  code: string;
};

export function transform(
  template: string | AST.Template,
  plugin: TransformPluginBuilder,
): TransformResult;
export function transform(options: TransformOptions): TransformResult;
export function transform(
  templateOrOptions: string | AST.Template | TransformOptions,
  plugin?: TransformPluginBuilder,
): TransformResult {
  let ast: AST.Template;
  let contents: string;
  let filePath: undefined | string;
  let template: string | AST.Template;

  if (plugin === undefined) {
    const options = templateOrOptions as TransformOptions;
    // TransformOptions invocation style
    filePath = options.filePath;
    plugin = options.plugin;
    template = options.template;
  } else {
    filePath = undefined;
    template = templateOrOptions as AST.Template;
  }

  if (typeof template === 'string') {
    ast = parse(template);
    contents = template;
  } else {
    // assume we were passed an ast
    ast = template;
    contents = print(ast);
  }

  const env: TransformPluginEnv = {
    contents,
    filePath,
    parseOptions: {
      srcName: filePath,
    },
    syntax: {
      Walker,
      builders,
      parse,
      print,
      traverse,
    },
  };

  const visitor = plugin(env);

  traverse(ast, visitor);

  return {
    ast,
    code: print(ast),
  };
}

export type { AST, NodeVisitor };
export { builders };
