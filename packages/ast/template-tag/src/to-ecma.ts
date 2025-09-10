import type { Parsed as TemplateTag } from 'content-tag';

import { findTemplateTags } from './find-template-tags.js';
import { replaceTemplateTag } from './replace-template-tag.js';

const BufferMap = new Map<string, Buffer>();

function getBuffer(str: string): Buffer {
  let buffer = BufferMap.get(str);

  if (!buffer) {
    buffer = Buffer.from(str);
    BufferMap.set(str, buffer);
  }

  return buffer;
}

function getCode(templateTag: TemplateTag): string {
  const { contents, range, type } = templateTag;

  const templateLength = range.endByte - range.startByte;
  const newContents = contents.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const total = templateLength - getBuffer(newContents).length;

  if (type === 'class-member') {
    const numSpaces = total - 'static{``}'.length;

    return `static{\`${newContents}${' '.repeat(numSpaces)}\`}`;
  }

  const numSpaces = total - '``'.length;

  return `\`${newContents}${' '.repeat(numSpaces)}\``;
}

/**
 * Converts a file with `<template>` tags to ECMAScript (JavaScript).
 *
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @return
 *
 * File in standard JavaScript.
 *
 * @example
 *
 * Analyze the JavaScript part of the file.
 *
 * ```ts
 * const ecma = toEcma(file);
 *
 * // Some method that checks `*.{js,ts}` files
 * analyze(ecma);
 * ```
 */
export function toEcma(file: string): string {
  const templateTags = findTemplateTags(file);

  templateTags.reverse().forEach((templateTag) => {
    const code = getCode(templateTag);

    file = replaceTemplateTag(file, {
      code,
      range: templateTag.range,
    });
  });

  return file;
}
