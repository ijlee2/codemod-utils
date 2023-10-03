import { renameSync } from 'node:fs';
import { join } from 'node:path';

import type { FilePathMap, Options } from '../types/index.js';
import { createDirectory } from './create-directory.js';
import { removeDirectoryIfEmpty } from './remove-directory-if-empty.js';

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
