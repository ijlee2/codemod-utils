import { join } from 'node:path';

import type { FilePath } from '../types/index.js';

export function renamePathByDirectory(
  filePath: FilePath,
  options: {
    from: string;
    to: string;
  },
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
