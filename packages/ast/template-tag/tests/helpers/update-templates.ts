import { AST } from '@codemod-utils/ast-template';

export function removeClassAttribute(file: string): string {
  const ast = AST.traverse(file, {
    // @ts-expect-error: Incorrect type
    AttrNode(node) {
      if (node.name !== 'class') {
        return;
      }

      return null;
    },
  });

  return AST.print(ast);
}
