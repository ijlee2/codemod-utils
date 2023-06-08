import { ASTJavaScript as AST } from '../../../src/index.js';

export function transformJavaScript(oldFile) {
  const traverse = AST.traverse();

  const ast = traverse(oldFile, {
    visitClassDeclaration(path) {
      const { body } = path.node.body;

      const nodesToAdd = [
        AST.builders.classProperty(
          AST.builders.identifier('styles'),
          AST.builders.identifier('styles'),
        ),
      ];

      if (body.length > 0) {
        nodesToAdd.push(AST.builders.noop());
      }

      body.unshift(...nodesToAdd);

      return false;
    },
  });

  const newFile = AST.print(ast);

  return newFile;
}

export function traverseJavaScript(oldFile) {
  const traverse = AST.traverse();

  const ast = traverse(oldFile);

  const newFile = AST.print(ast);

  return newFile;
}
