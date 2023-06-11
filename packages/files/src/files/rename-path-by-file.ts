import { parse } from 'node:path';

import type { FilePath } from '../types/index.js';

type Options = {
  find: {
    directory: string;
    file: string;
  };
  replace: (key: string) => string;
};

type ParsedPath = {
  dir: string;
  ext: string;
  name: string;
};

function parsePath(filePath: FilePath): ParsedPath {
  // eslint-disable-next-line prefer-const
  let { dir, ext, name } = parse(filePath);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { ext: extPrefix, name: fileName } = parse(name);

    if (extPrefix === '') {
      break;
    }

    ext = `${extPrefix}${ext}`;
    name = fileName;
  }

  return { dir, ext, name };
}

export function renamePathByFile(
  filePath: FilePath,
  options: Options,
): FilePath {
  const { find, replace } = options;
  const { dir, ext, name } = parsePath(filePath);

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
