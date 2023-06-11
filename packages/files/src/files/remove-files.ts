import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import type { FilePath, Options } from '../types/index.js';
import { removeDirectoryIfEmpty } from './remove-directory-if-empty.js';

export function removeFiles(filePaths: FilePath[], options: Options): void {
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
