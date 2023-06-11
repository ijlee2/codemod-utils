import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getFilePath(fileURL) {
  const __filename = fileURLToPath(fileURL);
  const __dirname = dirname(__filename);

  return __dirname;
}
