import { readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path/posix';

import type { FilePath, Options } from './types.js';

/**
 * Removes the directories specified in the file path, if they are
 * empty.
 *
 * ⚠️ Likely, you won't need this method but `removeFiles()` instead.
 *
 * @param filePath
 *
 * A file path.
 *
 * @param options
 *
 * An object with `projectRoot`.
 *
 * @example
 *
 * Remove the folder `ember-container-query` if it is empty.
 *
 * ```ts
 * const filePath = 'ember-container-query/LICENSE.md';
 *
 * removeDirectoryIfEmpty(filePath, {
 *   projectRoot,
 * });
 * ```
 */
export function removeDirectoryIfEmpty(
  filePath: FilePath,
  options: Options & {
    projectRoot: string;
  },
): void {
  const { projectRoot } = options;

  const directories = dirname(filePath).split('/');
  const depth = directories.length;

  for (let i = 0; i < depth; i++) {
    const directory = join(projectRoot, ...directories);
    const numFilesLeft = readdirSync(directory).length;

    if (numFilesLeft > 0) {
      continue;
    }

    rmSync(directory, { recursive: true });
    directories.pop();
  }
}
