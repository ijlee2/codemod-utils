import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

import { createDirectory } from './create-directory.js';

export function copyFiles(filePathMap, options) {
  const { projectRoot } = options;

  filePathMap.forEach((newFilePath, oldFilePath) => {
    const source = join(projectRoot, oldFilePath);
    const destination = join(projectRoot, newFilePath);

    createDirectory(destination);
    copyFileSync(source, destination);
  });
}
