import {
  type AST as _AST,
  builders,
  type NodeVisitor,
  print,
  transform,
} from 'ember-template-recast';

function traverse() {
  return function (
    file: string,
    visitMethods: NodeVisitor = {},
  ): _AST.Template {
    const { ast } = transform({
      plugin() {
        return visitMethods;
      },
      template: file,
    });

    return ast;
  };
}

/**
 * An object that provides `builders`, `print`, and `traverse`.
 * 
 * In a `traverse` call, you can specify how to visit the nodes of
 * interest ("visit methods") and how to modify them ("builders").
 *
 * @example
 *
 * ```ts
 * import { AST } from '@codemod-utils/ast-template';
 *
 * function transform(file: string): string {
 *   const traverse = AST.traverse();
 *
 *   const ast = traverse(file, {
 *     // Use AST.builders to transform the tree
 *   });
 *
 *   return AST.print(ast);
 * }
 * ```
 */
export const AST = {
  builders,
  print,
  traverse,
};
