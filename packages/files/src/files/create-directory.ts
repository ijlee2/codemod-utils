import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import type { FilePath } from '../types/index.js';

export function createDirectory(filePath: FilePath): void {
  const directory = dirname(filePath);

  if (existsSync(directory)) {
    return;
  }

  mkdirSync(directory, { recursive: true });
}
