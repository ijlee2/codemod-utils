import type { FilePath } from '../types/index.js';
import { parseFilePath } from './parse-file-path.js';

/**
 * Forms a new file path by altering the path's file name.
 *
 * @param filePath
 *
 * A file path.
 *
 * @param options
 *
 * An object with `find` and `replace`.
 *
 * @return
 *
 * A file path.
 *
 * @example
 *
 * Prepare to un-pod components.
 *
 * ```ts
 * const oldFilePath = 'app/components/navigation-menu/template.hbs';
 *
 * const newFilePath = renamePathByFile(oldFilePath, {
 *   find: {
 *     directory: 'app/components',
 *     file: 'template',
 *   },
 *   replace: (key: string) => {
 *     return `app/components/${key}`;
 *   },
 * });
 *
 * // newFilePath -> 'app/components/navigation-menu.hbs'
 * ```
 */
export function renamePathByFile(
  filePath: FilePath,
  options: {
    find: {
      directory: string;
      file: string;
    };
    replace: (key: string) => string;
  },
): FilePath {
  const { dir, ext, name } = parseFilePath(filePath);
  const { find, replace } = options;

  if (!dir.startsWith(find.directory)) {
    throw new RangeError(
      `ERROR: The provided path \`${filePath}\` doesn't match the directory pattern \`${find.directory}\`.\n`,
    );
  }

  if (name !== find.file) {
    throw new RangeError(
      `ERROR: The provided path \`${filePath}\` doesn't match the file pattern \`${find.file}\`.\n`,
    );
  }

  const key = filePath
    .replace(new RegExp(`^${find.directory}/`), '')
    .replace(new RegExp(`/${find.file}${ext}$`), '');

  return `${replace(key)}${ext}`;
}
