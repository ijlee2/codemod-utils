import { parse } from 'node:path';

import type { FilePath, ParsedPath } from '../types/index.js';

export function parseFilePath(filePath: FilePath): ParsedPath {
  // eslint-disable-next-line prefer-const
  let { base, dir, ext, name } = parse(filePath);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { ext: extPrefix, name: fileName } = parse(name);

    if (extPrefix === '') {
      break;
    }

    ext = `${extPrefix}${ext}`;
    name = fileName;
  }

  return { base, dir, ext, name };
}
