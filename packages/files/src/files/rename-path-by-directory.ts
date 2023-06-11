import { join } from 'node:path';

import type { FilePath } from '../types/index.js';

type Options = {
  from: string;
  to: string;
};

export function renamePathByDirectory(
  filePath: FilePath,
  options: Options,
): FilePath {
  const { from, to } = options;

  if (from === '') {
    return join(to, filePath);
  }

  if (!filePath.startsWith(`${from}/`)) {
    return filePath;
  }

  return join(to, filePath.replace(`${from}/`, ''));
}
