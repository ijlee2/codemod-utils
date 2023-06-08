import { parse } from 'node:path';

function parsePath(path) {
  let { dir, ext, name } = parse(path);

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

export function renameFile(oldFilePath, { find, replace }) {
  const { dir, ext, name } = parsePath(oldFilePath);

  if (!dir.startsWith(find.directory)) {
    throw new RangeError(
      `ERROR: The provided path \`${oldFilePath}\` doesn't match the directory pattern \`${find.directory}\`.\n`,
    );
  }

  if (name !== find.file) {
    throw new RangeError(
      `ERROR: The provided path \`${oldFilePath}\` doesn't match the file pattern \`${find.file}\`.\n`,
    );
  }

  const key = oldFilePath
    .replace(new RegExp(`^${find.directory}/`), '')
    .replace(new RegExp(`/${find.file}${ext}$`), '');

  const newFilePath = `${replace(key)}${ext}`;

  return newFilePath;
}
