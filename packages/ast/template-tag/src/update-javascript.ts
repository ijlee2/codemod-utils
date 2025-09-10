import { toEcma } from './to-ecma.js';
import { toTemplateTag } from './to-template-tag.js';

/**
 * Updates the JavaScript part of a file. Leaves the `<template>`
 * tags alone.
 *
 * @requires
 *
 * module:@codemod-utils/ast-javascript
 *
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @param update
 *
 * A method that describes how to update code.
 *
 * @return
 *
 * The resulting file.
 *
 * @example
 *
 * Reuse a method that can update `*.{js,ts}` files.
 *
 * ```ts
 * function transform(file: string): string {
 *   // ...
 * }
 *
 * const newFile = updateJavaScript(oldFile, transform);
 * ```
 *
 * @example
 *
 * Provide data when updating file.
 *
 * ```ts
 * type Data = {
 *   isTypeScript: boolean;
 * };
 *
 * function transform(file: string, data: Data): string {
 *   // ...
 * }
 *
 * const data = {
 *   isTypeScript: filePath.endsWith('.gts'),
 * };
 *
 * const newFile = updateJavaScript(oldFile, (file) => {
 *   return transform(file, data);
 * });
 * ```
 */
export function updateJavaScript(
  file: string,
  update: (code: string) => string,
): string {
  file = update(toEcma(file));

  return toTemplateTag(file);
}
