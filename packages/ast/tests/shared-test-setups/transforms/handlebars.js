import { ASTHandlebars as AST } from '../../../src/index.js';

export function transformHandlebars(file) {
  const traverse = AST.traverse();

  const ast = traverse(file, {
    AttrNode(node) {
      if (node.name !== 'local-class') {
        return;
      }

      node.name = 'class';

      const attributeValue = node.value.chars.trim();

      node.value = AST.builders.mustache(
        AST.builders.path(`this.styles.${attributeValue}`),
      );
    },
  });

  return AST.print(ast);
}

export function traverseHandlebars(file) {
  const traverse = AST.traverse();

  const ast = traverse(file);

  return AST.print(ast);
}
