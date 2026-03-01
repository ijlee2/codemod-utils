import { doubleColonize } from './double-colonize.js';

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
  const doubleColonizedName = doubleColonize(entityName);

  return doubleColonizedName.replaceAll('-', '').replaceAll('::', '');
}
