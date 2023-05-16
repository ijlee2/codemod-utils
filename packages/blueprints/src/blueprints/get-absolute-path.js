import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

export function getAbsolutePath() {
  return dirname(__filename);
}
