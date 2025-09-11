import { renamePathByDirectory } from './rename-path-by-directory.js';
import type { FilePath } from './types.js';

/**
 * Creates a mapping of file paths, which can then be passed to
 * `copyFiles()` or `moveFiles()`.
 *
 * @param filePaths
 *
 * An array of file paths. The array may come from `findFiles()`.
 *
 * @param options
 *
 * An object with `from` and `to`.
 *
 * @example
 *
 * Map `LICENSE.md` to `ember-container-query/LICENSE.md` (and
 * similarly for `README.md`).
 *
 * ```ts
 * const filePaths = ['LICENSE.md', 'README.md'];
 *
 * const filePathMap = mapFilePaths(filePaths, {
 *   from: '',
 *   to: 'ember-container-query',
 * });
 * ```
 */
export function mapFilePaths(
  filePaths: FilePath[],
  options: {
    from: string;
    to: string;
  },
) {
  const { from, to } = options;

  return new Map(
    filePaths.map((oldFilePath) => {
      const newFilePath = renamePathByDirectory(oldFilePath, { from, to });

      return [oldFilePath, newFilePath];
    }),
  );
}
