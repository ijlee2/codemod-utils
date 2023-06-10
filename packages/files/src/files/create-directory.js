import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function createDirectory(filePath) {
  const directory = dirname(filePath);

  if (existsSync(directory)) {
    return;
  }

  mkdirSync(directory, { recursive: true });
}
