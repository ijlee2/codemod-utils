import type { Range } from 'content-tag';

const BufferMap = new Map<string, Buffer>();

function getBuffer(str: string): Buffer {
  let buffer = BufferMap.get(str);

  if (!buffer) {
    buffer = Buffer.from(str);
    BufferMap.set(str, buffer);
  }

  return buffer;
}

function sliceByteRange(
  str: string,
  indexStart: number,
  indexEnd?: number,
): string {
  const buffer = getBuffer(str);

  return buffer.slice(indexStart, indexEnd).toString();
}

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
