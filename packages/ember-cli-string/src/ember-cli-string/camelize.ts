/* https://github.com/ember-cli/ember-cli-string-utils/blob/v1.1.0/index.js */
const STRING_CAMELIZE_REGEXP = /(-|_|\.|\s)+(.)?/g;

/**
 * Returns a string in camel-case.
 *
 * @param value
 *
 * A string.
 *
 * @return
 *
 * The string in camel case.
 *
 * @example
 *
 * ```ts
 * const newValue = camelize('css-class-name');
 *
 * // 'cssClassName'
 * ```
 */
export function camelize(value: string): string {
  return value
    .replace(
      STRING_CAMELIZE_REGEXP,
      function (_match, _separator, character: string) {
        return character ? character.toUpperCase() : '';
      },
    )
    .replace(/^([A-Z])/, function (match) {
      return match.toLowerCase();
    });
}
