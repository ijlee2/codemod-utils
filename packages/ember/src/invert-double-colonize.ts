function dasherize(value: string): string {
  let newValue = '';

  for (let i = 0; i < value.length; i++) {
    const character = value.charAt(i);
    const characterLowerCased = character.toLowerCase();

    if (i === 0 || character === characterLowerCased) {
      newValue += characterLowerCased;
      continue;
    }

    newValue += `-${characterLowerCased}`;
  }

  return newValue;
}

/**
 * Converts a double-colonized name back to an entity name.
 *
 * @param name
 *
 * An entity's name in double colon case.
 *
 * @return
 *
 * The name of an entity (made up of lowercase letters, hyphen,
 * and forward slash).
 *
 * @example
 *
 * ```ts
 * const output = invertDoubleColonize('Ui::Form::Input');
 *
 * // 'ui/form/input'
 * ```
 */
export function invertDoubleColonize(name: string): string {
  return name.split('::').map(dasherize).join('/');
}
