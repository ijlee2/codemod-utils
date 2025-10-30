import { builders, print, traverse } from './-private/recast.js';

type AST = {
  builders: typeof builders;
  print: typeof print;
  traverse: typeof traverse;
};

/**
 * Provides methods from `recast` to help you parse and transform
 * `*.{js,ts}` files.
 *
 * @example
 *
 * ```ts
 * type Data = {
 *   isTypeScript: boolean;
 * };
 *
 * function transform(file: string, data: Data): string {
 *   const traverse = AST.traverse(data.isTypeScript);
 *
 *   const ast = traverse(file, {
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
