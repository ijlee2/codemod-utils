/**
 * Converts a Map (back) to an object. Together with `convertToMap()`,
 * you can update JSONs.
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
 *
 * @example
 *
 * Configure `tsconfig.json` in an Ember app.
 *
 * ```ts
 * const compilerOptions = convertToMap(tsConfigJson['compilerOptions']);
 *
 * compilerOptions.set('paths', {
 *   [`${appName}/tests/*`]: ['tests/*'],
 *   [`${appName}/*`]: ['app/*'],
 *   '*': ['types/*'],
 * });
 *
 * tsConfigJson['compilerOptions'] = convertToObject(compilerOptions);
 * ```
 */
export function convertToObject(map = new Map()) {
  const sortedMap = new Map([...map.entries()].sort());

  return Object.fromEntries(sortedMap);
}
