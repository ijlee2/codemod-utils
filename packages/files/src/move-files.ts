import { renameSync } from 'node:fs';
import { join } from 'node:path';

import { createDirectory } from './create-directory.js';
import { removeDirectoryIfEmpty } from './remove-directory-if-empty.js';
import type { FilePathMap, Options } from './types.js';

/**
 * Moves files from one directory (source) to another (destination).
 * Creates the destination directory if it doesn't exist. Removes
 * the source directory if it is empty.
 *
 * @param filePathMap
 *
 * A mapping from source to destination.
 *
 * @param options
 *
 * An object with `projectRoot`.
 *
 * @example
 *
 * Move `LICENSE.md` and `README.md` from the project root to a
 * folder named `ember-container-query`.
 *
 * ```ts
 * const filePathMap = new Map([
 *   ['LICENSE.md', 'ember-container-query/LICENSE.md'],
 *   ['README.md', 'ember-container-query/README.md'],
 * ]);
 *
 * moveFiles(filePathMap, {
 *   projectRoot,
 * });
 * ```
 */
export function moveFiles(
  filePathMap: FilePathMap,
  options: Options & {
    projectRoot: string;
  },
): void {
  const { projectRoot } = options;

  filePathMap.forEach((newFilePath, oldFilePath) => {
    const source = join(projectRoot, oldFilePath);
    const destination = join(projectRoot, newFilePath);

    createDirectory(destination);
    renameSync(source, destination);
    removeDirectoryIfEmpty(oldFilePath, { projectRoot });
  });
}
