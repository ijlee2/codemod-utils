import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path/posix';

import { removeDirectoryIfEmpty } from './remove-directory-if-empty.js';
import type { FilePath, Options } from './types.js';

/**
 * Removes files. Removes the source directory if it is empty.
 *
 * @param filePaths
 *
 * An array of file paths.
 *
 * @param options
 *
 * An object with `projectRoot`.
 *
 * @example
 *
 * Remove `LICENSE.md` and `README.md` from the project root.
 *
 * ```ts
 * const filePaths = ['LICENSE.md', 'README.md'];
 *
 * removeFiles(filePaths, {
 *   projectRoot,
 * });
 * ```
 */
export function removeFiles(
  filePaths: FilePath[],
  options: Options & {
    projectRoot: string;
  },
): void {
  const { projectRoot } = options;

  filePaths.forEach((filePath) => {
    const source = join(projectRoot, filePath);

    if (!existsSync(source)) {
      return;
    }

    rmSync(source);
    removeDirectoryIfEmpty(filePath, options);
  });
}
