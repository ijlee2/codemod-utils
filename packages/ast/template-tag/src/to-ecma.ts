import { Preprocessor } from 'content-tag';

const preprocessor = new Preprocessor();

/**
 * Converts a file with `<template>` tags to standard JavaScript.
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
  const { code } = preprocessor.process(file);

  return code;
}
