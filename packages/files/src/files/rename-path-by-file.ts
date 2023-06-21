import type { FilePath } from '../types/index.js';
import { parseFilePath } from './parse-file-path.js';

type Options = {
  find: {
    directory: string;
    file: string;
  };
  replace: (key: string) => string;
};

export function renamePathByFile(
  filePath: FilePath,
  options: Options,
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
