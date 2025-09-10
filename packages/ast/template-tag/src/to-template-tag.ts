/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { AST } from '@codemod-utils/ast-javascript';

export function toTemplateTag(ecma: string): string {
  const traverse = AST.traverse(true);

  const ast = traverse(ecma, {
    visitImportDeclaration(node) {
      if (
        node.value.source.type !== 'StringLiteral' ||
        node.value.source.value !== '@ember/template-compiler'
      ) {
        return false;
      }

      // For simplicity, always remove the import statement
      return null;
    },
  });

  return AST.print(ast);
}
