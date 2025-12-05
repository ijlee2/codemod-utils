import { join, normalize, sep } from 'node:path';

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
  filePath = normalize(filePath);
  const from = normalize(options.from);
  const to = normalize(options.to);

  if (options.from === '') {
    return join(to, filePath);
  }

  if (!filePath.startsWith(`${from}${sep}`)) {
    return filePath;
  }

  return join(to, filePath.replace(`${from}${sep}`, ''));
}
