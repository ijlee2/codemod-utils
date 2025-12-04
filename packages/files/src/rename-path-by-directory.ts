import { join, sep } from 'node:path';

import { normalizeFilePath } from './normalize-file-path.js';
import type { FilePath } from './types.js';

/**
 * Forms a new file path by altering the path's directory.
 *
 * @param filePath
 *
 * A file path.
 *
 * @param options
 *
 * An object with `from` and `to`.
 *
 * @return
 *
 * A file path.
 *
 * @example
 *
 * Prepare to move components from `addon` to `ember-container-query/src`.
 *
 * ```ts
 * const oldFilePath = 'addon/components/container-query.hbs';
 *
 * const newFilePath = renamePathByDirectory(oldFilePath, {
 *   from: 'addon',
 *   to: 'ember-container-query/src',
 * });
 *
 * // newFilePath -> 'ember-container-query/src/components/container-query.hbs'
 * ```
 */
export function renamePathByDirectory(
  filePath: FilePath,
  options: {
    from: string;
    to: string;
  },
): FilePath {
  filePath = normalizeFilePath(filePath);
  const from = normalizeFilePath(options.from);
  const to = normalizeFilePath(options.to);

  if (from === '') {
    return join(to, filePath);
  }

  if (!filePath.startsWith(`${from}${sep}`)) {
    return filePath;
  }

  return join(to, filePath.replace(`${from}${sep}`, ''));
}
