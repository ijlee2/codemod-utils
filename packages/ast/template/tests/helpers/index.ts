import { AST } from '../../src/index.js';

export function transform(file: string): string {
  const ast = AST.traverse(file, {
    AttrNode(node) {
      if (node.name !== 'local-class') {
        return;
      }

      if (node.value.type === 'TextNode') {
        node.name = 'class';

        const attributeValue = node.value.chars.trim();

        node.value = AST.builders.mustache(
          AST.builders.path(`this.styles.${attributeValue}`),
        );
      }
    },
  });

  return AST.print(ast);
}

export function traverse(file: string): string {
  const ast = AST.traverse(file);

  return AST.print(ast);
}
