const MARKER = 'template_fd9b2463e5f141cfb5666b64daa1f11a';

function markTemplateTags(file: string): string {
  const lines = file.split('\n');

  return lines
    .reduce<string[]>((accumulator, line) => {
      if (line.includes('<template>')) {
        accumulator.push(`/* ${MARKER}`);
      }

      accumulator.push(line);

      if (line.includes('</template>')) {
        accumulator.push(`${MARKER} */`);
      }

      return accumulator;
    }, [])
    .join('\n');
}

function unmarkTemplateTags(file: string): string {
  const lines = file.split('\n');

  return lines
    .reduce<string[]>((accumulator, line) => {
      if (line.includes(`/* ${MARKER}`) || line.includes(`${MARKER} */`)) {
        return accumulator;
      }

      accumulator.push(line);

      return accumulator;
    }, [])
    .join('\n');
}

/**
 * Updates the JavaScript part of a file. Leaves the `<template>`
 * tags alone.
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
 * Reuse a method that can update `*.{js,ts}` files.
 *
 * ```ts
 * function transform(file: string): string {
 *   // ...
 * }
 *
 * const newFile = updateJavaScript(oldFile, transform);
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
 * const newFile = updateJavaScript(oldFile, (file) => {
 *   return transform(file, data);
 * });
 * ```
 */
export function updateJavaScript(
  file: string,
  update: (code: string) => string,
): string {
  file = update(markTemplateTags(file));

  return unmarkTemplateTags(file);
}
