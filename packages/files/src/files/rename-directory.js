import { join } from 'node:path';

export function renameDirectory(oldFilePath, { from, to }) {
  if (from === '') {
    return join(to, oldFilePath);
  }

  if (!oldFilePath.startsWith(`${from}/`)) {
    return oldFilePath;
  }

  const newFilePath = join(to, oldFilePath.replace(`${from}/`, ''));

  return newFilePath;
}
