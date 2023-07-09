import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createFiles, findFiles } from '@codemod-utils/files';

export function addEndOfLine(options) {
  const { projectRoot } = options;

  const filePaths = findFiles('**/*.txt', {
    projectRoot,
  });

  const fileMap = new Map(
    filePaths.map((filePath) => {
      const file = readFileSync(join(projectRoot, filePath), 'utf8');

      const newFile = file.endsWith('\n') ? file : `${file}\n`;

      return [filePath, newFile];
    }),
  );

  createFiles(fileMap, options);
}
