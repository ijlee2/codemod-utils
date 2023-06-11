import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { createDirectory } from './create-directory.js';

export function createFiles(fileMap, options) {
  const { projectRoot } = options;

  fileMap.forEach((file, filePath) => {
    const destination = join(projectRoot, filePath);

    createDirectory(destination);
    writeFileSync(destination, file, 'utf8');
  });
}
