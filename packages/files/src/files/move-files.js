import { renameSync } from 'node:fs';
import { join } from 'node:path';

import { createDirectory } from './create-directory.js';
import { removeDirectoryIfEmpty } from './remove-directory-if-empty.js';
import { renamePathByDirectory } from './rename-path-by-directory.js';

export function moveFiles(filePaths, options) {
  const { from, projectRoot, to } = options;

  filePaths.forEach((oldFilePath) => {
    const newFilePath = renamePathByDirectory(oldFilePath, { from, to });

    const source = join(projectRoot, oldFilePath);
    const destination = join(projectRoot, newFilePath);

    createDirectory(destination);
    renameSync(source, destination);
    removeDirectoryIfEmpty(oldFilePath, { projectRoot });
  });
}
