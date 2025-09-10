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
 * Replaces the template of a particular `<template>` tag.
 *
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @param data
 *
 * An object with `range` (tag location) and `template` (what to
 * replace with).
 *
 * @return
 *
 * The resulting file.
 *
 * @example
 *
 * Update the template in each tag.
 *
 * ```ts
 * const templateTags = findTemplateTags(file);
 *
 * templateTags.reverse().forEach(({ contents, range }) => {
 *   // Some method that can update `*.hbs` files
 *   const template = transform(contents);
 *
 *   file = replaceTemplate(file, { range, template });
 * });
 * ```
 */
export function replaceTemplate(
  file: string,
  data: {
    range: Range;
    template: string;
  },
): string {
  const { range, template } = data;

  return [
    sliceByteRange(file, 0, range.startByte),
    '<template>',
    template,
    '</template>',
    sliceByteRange(file, range.endByte, undefined),
  ].join('');
}
