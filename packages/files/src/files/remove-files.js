import { rmSync } from 'node:fs';
import { join } from 'node:path';

import { removeDirectoryIfEmpty } from './remove-directory-if-empty.js';

export function removeFiles(filePaths, options) {
  const { projectRoot } = options;

  filePaths.forEach((filePath) => {
    const source = join(projectRoot, filePath);

    rmSync(source);
    removeDirectoryIfEmpty(filePath, options);
  });
}
