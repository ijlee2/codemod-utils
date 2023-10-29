import {
  type AST as _AST,
  builders,
  type NodeVisitor,
  print,
  transform,
} from 'ember-template-recast';

function _traverse() {
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
 * Provides methods from `ember-template-recast` to help you parse
 * and transform `*.hbs` files.
 *
 * @example
 *
 * ```ts
 * import { AST } from '@codemod-utils/ast-template';
 *
 * function transformCode(file: string): string {
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
  traverse: _traverse,
};
