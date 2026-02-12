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
