/* https://github.com/ember-cli/ember-cli-string-utils/blob/v1.1.0/index.js */
const STRING_CAMELIZE_REGEXP = /(-|_|\.|\s)+(.)?/g;

export function camelize(value: string): string {
  return value
    .replace(STRING_CAMELIZE_REGEXP, function (_match, _separator, character) {
      return character ? character.toUpperCase() : '';
    })
    .replace(/^([A-Z])/, function (match) {
      return match.toLowerCase();
    });
}
