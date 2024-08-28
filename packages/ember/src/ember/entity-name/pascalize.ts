function _pascalize(value: string): string {
  return value
    .split('-')
    .map((token) => {
      return token.charAt(0).toUpperCase() + token.substring(1).toLowerCase();
    })
    .join('');
}

/**
 * Converts an entity name to Pascal case. Used for naming the
 * class that is associated with the entity.
 *
 * @param entityName
 *
 * The name of an entity (made up of lowercase letters, hyphen,
 * and forward slash).
 *
 * @return
 *
 * The name in Pascal case.
 *
 * @example
 *
 * ```ts
 * const newValue = pascalize('ui/form/input');
 *
 * // 'UiFormInput'
 * ```
 */
export function pascalize(entityName: string): string {
  return entityName.split('/').map(_pascalize).join('');
}
