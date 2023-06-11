import { readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';

import type { FilePath, Options } from '../types/index.js';

export function removeDirectoryIfEmpty(
  filePath: FilePath,
  options: Options,
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
