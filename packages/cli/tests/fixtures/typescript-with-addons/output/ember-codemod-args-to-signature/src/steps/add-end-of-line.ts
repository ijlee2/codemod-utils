import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

export function addEndOfLine(options: Options): void {
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
