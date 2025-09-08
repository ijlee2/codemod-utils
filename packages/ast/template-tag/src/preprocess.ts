import { type Parsed as TemplateTag, Preprocessor } from 'content-tag';

const preprocessor = new Preprocessor();

/**
 * Processes a file with `<template>` tags into things that work
 * with existing methods or libraries.
 *
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @return
 *
 * An object with `javascript` (code in standard JavaScript) and
 * `templateTags` (a sorted array that tracks tag locations).
 *
 * @example
 *
 * Analyze the JavaScript part of the file.
 *
 * ```ts
 * const { javascript } = preprocess(file);
 *
 * // Some method that checks `*.{js,ts}` files
 * analyze(javascript);
 * ```
 *
 * @example
 *
 * Count the number of lines inside `<template>` tags.
 *
 * ```ts
 * const { templateTags } = preprocess(file);
 *
 * let numOfLines = 0;
 *
 * templateTags.forEach(({ contents }) => {
 *   numOfLines += contents.trim().split('\n').length;
 * });
 * ```
 */
export function preprocess(file: string): {
  javascript: string;
  templateTags: TemplateTag[];
} {
  const javascript = preprocessor.process(file).code;
  const templateTags = preprocessor.parse(file);

  return {
    javascript,
    templateTags,
  };
}
