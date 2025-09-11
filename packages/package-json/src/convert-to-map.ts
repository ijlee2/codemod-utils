/**
 * Converts an object to a Map. Use it with `convertToObject()`
 * to update objects in `package.json`.
 *
 * @param object
 *
 * An object.
 *
 * @return
 *
 * The object as a Map.
 *
 * @example
 *
 * Remove dependencies (if they exist) from `package.json`.
 *
 * ```ts
 * const dependencies = convertToMap(packageJson['dependencies']);
 *
 * const packagesToDelete = [
 *   '@embroider/macros',
 *   'ember-auto-import',
 *   'ember-cli-babel',
 *   'ember-cli-htmlbars',
 * ];
 *
 * packagesToDelete.forEach((packageName) => {
 *   dependencies.delete(packageName);
 * });
 *
 * packageJson['dependencies'] = convertToObject(dependencies);
 * ```
 */
export function convertToMap(object = {}) {
  const entries = Object.entries(object);

  return new Map(entries);
}
