import { sep } from 'node:path';

import type { FilePath } from './types.js';

const onWindows = sep === '\\';

/**
 * Converts a file path to work on Windows as needed.
 *
 * @param filePath
 *
 * A file path (for POSIX).
 *
 * @return
 *
 * The same path on POSIX. The converted path on Windows.
 */
export function normalizeFilePath(filePath: FilePath): FilePath {
  if (onWindows) {
    return filePath.replaceAll('/', sep);
  }

  return filePath;
}
