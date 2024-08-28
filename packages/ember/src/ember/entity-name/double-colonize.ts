function _pascalize(value: string): string {
  return value
    .split('-')
    .map((token) => {
      return token.charAt(0).toUpperCase() + token.substring(1).toLowerCase();
    })
    .join('');
}

/**
 * Converts an entity name to double colon (`::`) case. Used for
 * writing the angle bracket syntax or the signature for a component.
 *
 * @param entityName
 *
 * The name of an entity (made up of lowercase letters, hyphen,
 * and forward slash).
 *
 * @return
 *
 * The name in double colon case.
 *
 * @example
 *
 * ```ts
 * const newValue = doubleColonize('ui/form/input');
 *
 * // 'Ui::Form::Input'
 * ```
 */
export function doubleColonize(entityName: string): string {
  return entityName.split('/').map(_pascalize).join('::');
}
