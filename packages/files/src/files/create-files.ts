import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { FileMap, Options } from '../types/index.js';
import { createDirectory } from './create-directory.js';

/**
 * Creates files. Creates the destination directory if it doesn't
 * exist.
 *
 * @param fileMap
 *
 * A mapping between the file path and the file content (UTF-8).
 *
 * @param options
 *
 * An object with `projectRoot`.
 *
 * @example
 *
 * Create `LICENSE.md` and `README.md` in the project root.
 *
 * ```ts
 * const fileMap = new Map([
 *   ['LICENSE.md', 'The MIT License (MIT)'],
 *   ['README.md', '# ember-container-query'],
 * ]);
 *
 * createFiles(fileMap, {
 *   projectRoot,
 * });
 * ```
 */
export function createFiles(
  fileMap: FileMap,
  options: Options & {
    projectRoot: string;
  },
): void {
  const { projectRoot } = options;

  fileMap.forEach((file, filePath) => {
    const destination = join(projectRoot, filePath);

    createDirectory(destination);
    writeFileSync(destination, file, 'utf8');
  });
}
