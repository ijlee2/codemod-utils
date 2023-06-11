import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { FileMap, Options } from '../types/index.js';
import { createDirectory } from './create-directory.js';

export function createFiles(fileMap: FileMap, options: Options): void {
  const { projectRoot } = options;

  fileMap.forEach((file, filePath) => {
    const destination = join(projectRoot, filePath);

    createDirectory(destination);
    writeFileSync(destination, file, 'utf8');
  });
}
