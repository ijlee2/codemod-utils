import { findTemplateTags } from './find-template-tags.js';
import { replaceTemplateTag } from './replace-template-tag.js';

/**
 * Updates the `<template>` tags in a file. Leaves the JavaScript
 * part alone.
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
 * Reuse a method that can update `*.hbs` files.
 *
 * ```ts
 * function transform(file: string): string {
 *   // ...
 * }
 *
 * const newFile = updateTemplates(oldFile, transform);
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
 * const newFile = updateTemplates(oldFile, (file) => {
 *   return transform(file, data);
 * });
 * ```
 */
export function updateTemplates(
  file: string,
  update: (code: string) => string,
): string {
  const templateTags = findTemplateTags(file);

  templateTags.reverse().forEach(({ contents, range }) => {
    const template = update(contents);

    file = replaceTemplateTag(file, {
      code: `<template>${template}</template>`,
      range,
    });
  });

  return file;
}
