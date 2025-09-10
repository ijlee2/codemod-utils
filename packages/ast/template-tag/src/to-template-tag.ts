import { removeMarkers } from './-private/to-template-tag.js';

/**
 * Converts an ECMA file to show `<template>` tags.
 *
 * @requires
 *
 * module:@codemod-utils/ast-javascript
 *
 * @param file
 *
 * A `*.{gjs,gts}` file converted to ECMAScript.
 *
 * @return
 *
 * File with `<template>` tags.
 *
 * @example
 *
 * Update `*.{gjs,gts}` files.
 *
 * ```ts
 * // Some method that updates `*.{js,ts}` files
 * function transform(file: string): string {
 *   // ...
 * }
 *
 * file = toTemplateTag(transform(toEcma(file)));
 * ```
 */
export function toTemplateTag(file: string): string {
  return removeMarkers(file);
}
