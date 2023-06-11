import { join } from 'node:path';

export function renamePathByDirectory(filePath, options) {
  const { from, to } = options;

  if (from === '') {
    return join(to, filePath);
  }

  if (!filePath.startsWith(`${from}/`)) {
    return filePath;
  }

  return join(to, filePath.replace(`${from}/`, ''));
}
