import { ASTJavaScript as AST } from '../../../src/index.js';

export function transformTypeScript(file: string) {
  const traverse = AST.traverse(true);

  const ast = traverse(file, {
    visitClassDeclaration(path) {
      const { body } = path.node.body;

      const nodesToAdd = [
        AST.builders.classProperty(
          AST.builders.identifier('styles'),
          AST.builders.identifier('styles'),
        ),
      ];

      body.unshift(...nodesToAdd);

      return false;
    },
  });

  return AST.print(ast);
}

export function traverseTypeScript(file: string) {
  const traverse = AST.traverse(true);

  const ast = traverse(file);

  return AST.print(ast);
}
