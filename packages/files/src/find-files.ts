import { globSync } from 'glob';

import type { FilePath, Options } from './types.js';

/**
 * Returns the paths of all files that match your search criteria
 * (i.e. {@link https://github.com/isaacs/node-glob#glob-primer | glob pattern}, ignore list, and project root).
 * The paths are sorted in alphabetical order.
 *
 * @param pattern
 *
 * A glob pattern that describes which files you are looking for.
 *
 * ⚠️ Glob patterns should always use `/` as a path separator,
 * even on Windows systems.
 *
 * @param options
 *
 * An object with `ignoreList` (an array of file paths or glob
 * patterns) and `projectRoot`.
 *
 * @return
 *
 * Paths of all files that match your search criteria.
 *
 * @example
 *
 * Find all component templates in an Ember app.
 *
 * ```ts
 * const filePaths = findFiles('app/components/**\/*.hbs', {
 *   projectRoot,
 * });
 * ```
 *
 * @example
 *
 * Find all component classes in an Ember app.
 *
 * ```ts
 * const filePaths = findFiles('app/components/**\/*.{js,ts}', {
 *   ignoreList: ['**\/*.d.ts'],
 *   projectRoot,
 * });
 * ```
 *
 * @example
 *
 * Pass an array of glob patterns (pattern A or pattern B or ...).
 *
 * ```ts
 * const filePaths = findFiles([
 *   'LICENSE.md',
 *   'README.md',
 * ], {
 *   projectRoot,
 * });
 * ```
 *
 * ```ts
 * const filePaths = findFiles([
 *   'app/components/**\/*.hbs',
 *   'tests/integration/components/**\/*-test.{js,ts}',
 * ], {
 *   projectRoot,
 * });
 * ```
 */
export function findFiles(
  pattern: string | string[],
  options: Options & { ignoreList?: string[]; projectRoot: string },
): FilePath[] {
  const { ignoreList = [], projectRoot } = options;

  if (!pattern) {
    throw new RangeError('ERROR: The glob pattern is undefined.');
  }

  if (!projectRoot) {
    throw new RangeError('ERROR: The project root is undefined.');
  }

  const filePaths = globSync(pattern, {
    cwd: projectRoot,
    dot: true,
    ignore: ignoreList,
    nodir: true,
  });

  return filePaths.sort();
}
