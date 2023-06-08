import { ASTHandlebars as AST } from '../../../src/index.js';

export function transformHandlebars(oldFile) {
  const ast = AST.traverse(oldFile, {
    AttrNode(node) {
      if (node.name !== 'local-class') {
        return;
      }

      node.name = 'class';

      node.value = AST.builders.mustache(
        AST.builders.path('this.styles.container'),
      );
    },
  });

  const newFile = AST.print(ast);

  return newFile;
}

export function traverseHandlebars(oldFile) {
  const ast = AST.traverse(oldFile);

  const newFile = AST.print(ast);

  return newFile;
}
