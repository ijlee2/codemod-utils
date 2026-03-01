import { pascalize } from './pascalize.js';

/**
 * Converts an entity name to camel case. Used for naming the
 * function that is associated with the entity.
 *
 * @param entityName
 *
 * The name of an entity (made up of lowercase letters, hyphen,
 * and forward slash).
 *
 * @return
 *
 * The name in camel case.
 *
 * @example
 *
 * ```ts
 * const newValue = camelize('ui/form/generate-error-message');
 *
 * // 'uiFormGenerateErrorMessage'
 * ```
 */
export function camelize(entityName: string): string {
  const pascalizedName = pascalize(entityName);

  return pascalizedName.charAt(0).toLowerCase() + pascalizedName.substring(1);
}
