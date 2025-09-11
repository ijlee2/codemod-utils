/**
 * Converts a Map (back) to an object. Use it with `convertToMap()`
 * to update objects in `package.json`.
 *
 * @param object
 *
 * A Map.
 *
 * @return
 *
 * The Map as an object. (The object keys are sorted in alphabetical
 * order.)
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
export function convertToObject(map = new Map()) {
  const sortedMap = new Map([...map.entries()].sort());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.fromEntries(sortedMap);
}
