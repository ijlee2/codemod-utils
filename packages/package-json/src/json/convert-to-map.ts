/**
 * Converts an object to a Map. Together with `convertToObject()`,
 * you can update JSONs.
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
export function convertToMap(object = {}) {
  const entries = Object.entries(object);

  return new Map(entries);
}
