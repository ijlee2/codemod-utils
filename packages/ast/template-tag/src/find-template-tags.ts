import { preprocessor, type TemplateTag } from './-private/content-tag.js';

/**
 * Finds `<template>` tags in a file.
 *
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @return
 *
 * A sorted array that tracks tag contents and locations.
 *
 * @example
 *
 * Count the number of lines of code (LOC) in `<template>` tags.
 *
 * ```ts
 * function getLOC(file: string): number {
 *   const matches = file.match(/\r?\n/g);
 *
 *   return (matches ?? []).length;
 * }
 *
 * const templateTags = findTemplateTags(file);
 *
 * let loc = 0;
 *
 * templateTags.forEach(({ contents }) => {
 *   loc += getLOC(contents.trim());
 * });
 * ```
 */
export function findTemplateTags(file: string): TemplateTag[] {
  const templateTags = preprocessor.parse(file);

  return templateTags;
}

export type { TemplateTag };
