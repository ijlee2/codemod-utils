import { builders, print, traverse } from './-private/recast.js';

type AST = {
  builders: typeof builders;
  print: typeof print;
  traverse: typeof traverse;
};

/**
 * An object that provides `builders`, `print`, and `traverse`.
 *
 * In a `traverse` call, you can specify how to visit the nodes of
 * interest ("visit methods") and how to modify them ("builders").
 *
 * @example
 *
 * ```ts
 * import { AST } from '@codemod-utils/ast-javascript';
 *
 * function transform(file: string): string {
 *   const ast = AST.traverse(file, {
 *     // Use AST.builders to transform the tree
 *   });
 *
 *   return AST.print(ast);
 * }
 * ```
 */
export const AST: AST = {
  builders,
  print,
  traverse,
};
