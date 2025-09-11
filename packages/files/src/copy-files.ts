import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

import { createDirectory } from './create-directory.js';
import type { FilePathMap, Options } from './types.js';

/**
 * Copies files from one directory (source) to another (destination).
 * Creates the destination directory if it doesn't exist.
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
 * Copy `LICENSE.md` and `README.md` from the project root to the
 * folder `ember-container-query`.
 *
 * ```ts
 * const filePathMap = new Map([
 *   ['LICENSE.md', 'ember-container-query/LICENSE.md'],
 *   ['README.md', 'ember-container-query/README.md'],
 * ]);
 *
 * copyFiles(filePathMap, {
 *   projectRoot,
 * });
 * ```
 */
export function copyFiles(
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
    copyFileSync(source, destination);
  });
}
