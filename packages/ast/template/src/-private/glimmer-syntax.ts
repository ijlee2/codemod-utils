import {
  type AST,
  builders,
  type NodeVisitor,
  preprocess,
  print as upstreamPrint,
  traverse as upstreamTraverse,
} from '@glimmer/syntax';

export function parse(file: string): AST.Template {
  const ast = preprocess(file, {
    mode: 'codemod',
  });

  return ast;
}

export function print(ast: AST.Node): string {
  return upstreamPrint(ast, {
    entityEncoding: 'raw',
  });
}

export function traverse() {
  return function (file: string, visitMethods: NodeVisitor = {}): AST.Template {
    const ast = preprocess(file, {
      mode: 'codemod',
    });

    upstreamTraverse(ast, visitMethods);

    return ast;
  };
}

export { builders };
