import { AST } from '@codemod-utils/ast-template';

export function identity(file: string): string {
  return file;
}

export function removeClassAttribute(file: string): string {
  const traverse = AST.traverse();

  const ast = traverse(file, {
    AttrNode(node) {
      if (node.name !== 'class') {
        return;
      }

      return null;
    },
  });

  return AST.print(ast);
}
