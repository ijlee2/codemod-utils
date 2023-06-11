import { ASTHandlebars as AST } from '../../../src/index.js';

export function transformHandlebars(file: string) {
  const traverse = AST.traverse();

  const ast = traverse(file, {
    AttrNode(node) {
      if (node.name !== 'local-class') {
        return;
      }

      node.name = 'class';

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Property 'chars' does not exist on type 'TextNode | MustacheStatement | ConcatStatement'.
      const attributeValue = node.value.chars.trim();

      node.value = AST.builders.mustache(
        AST.builders.path(`this.styles.${attributeValue}`),
      );
    },
  });

  return AST.print(ast);
}

export function traverseHandlebars(file: string) {
  const traverse = AST.traverse();

  const ast = traverse(file);

  return AST.print(ast);
}
