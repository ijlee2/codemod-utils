import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import type { FilePath } from './types.js';

/**
 * Creates the directories specified in the file path, if they don't
 * exist yet.
 *
 * ⚠️ Likely, you won't need this method but `createFiles()` instead.
 *
 * @param filePath
 *
 * A file path.
 *
 * @example
 *
 * Create the folder `ember-container-query` if it doesn't exist.
 *
 * ```ts
 * const newFilePath = 'ember-container-query/LICENSE.md';
 * const destination = join(projectRoot, newFilePath);
 *
 * createDirectory(destination);
 * ```
 */
export function createDirectory(filePath: FilePath): void {
  const directory = dirname(filePath);

  if (existsSync(directory)) {
    return;
  }

  mkdirSync(directory, { recursive: true });
}
