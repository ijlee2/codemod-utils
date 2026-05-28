import { AST } from '../../src/index.js';

export function transform(file: string): string {
  const ast = AST.traverse(file, {
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

export function traverse(file: string): string {
  const ast = AST.traverse(file);

  return AST.print(ast);
}
