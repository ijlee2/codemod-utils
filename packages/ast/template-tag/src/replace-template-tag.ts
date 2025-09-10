import { type Range, sliceByteRange } from './-private/content-tag.js';

/**
 * Replaces a particular `<template>` tag.
 *
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @param data
 *
 * An object with `range` (tag location) and `code` (what to
 * replace with).
 *
 * @return
 *
 * The resulting file.
 *
 * @example
 *
 * Update all template tags in a file.
 *
 * ```ts
 * const templateTags = findTemplateTags(file);
 *
 * templateTags.reverse().forEach(({ contents, range }) => {
 *   // Some method that can update `*.hbs` files
 *   const template = transform(contents);
 *
 *   file = replaceTemplateTag(file, {
 *     code: `<template>${template}</template>`,
 *     range,
 *   });
 * });
 * ```
 */
export function replaceTemplateTag(
  file: string,
  data: {
    code: string;
    range: Range;
  },
): string {
  const { code, range } = data;

  return [
    sliceByteRange(file, 0, range.startByte),
    code,
    sliceByteRange(file, range.endByte, undefined),
  ].join('');
}
