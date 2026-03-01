function emberize(value: string): string {
  const tokens = value.split('-').map((token) => {
    return token.charAt(0).toUpperCase() + token.substring(1).toLowerCase();
  });

  return tokens.reduce((accumulator, token) => {
    const startsWithNumber = /^\d/.test(token);

    accumulator += startsWithNumber ? `-${token}` : token;

    return accumulator;
  });
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
  return entityName.split('/').map(emberize).join('::');
}
