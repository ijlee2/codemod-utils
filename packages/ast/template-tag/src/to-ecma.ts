import { MARKER } from './-private/content-tag.js';
import { findMarkers } from './-private/to-ecma.js';
import { findTemplateTags } from './find-template-tags.js';
import { replaceTemplateTag } from './replace-template-tag.js';

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

  if (templateTags.length === 0) {
    return file;
  }

  const markers = findMarkers(file);

  if (markers.length !== templateTags.length) {
    throw new RangeError("ERROR: `findMarkers()` couldn't find all markers.");
  }

  templateTags.reverse().forEach(({ range }, index) => {
    const { code } = markers[index]!;

    file = replaceTemplateTag(file, {
      code,
      range,
    });
  });

  // Need to sanitize because `content-tag` treats `<template></template>;`
  // and `export default <template>/template>;` the same
  file = file.replace('export default export default', 'export default');

  return [
    `import { template as ${MARKER} } from "@ember/template-compiler";`,
    file,
  ].join('\n');
}
