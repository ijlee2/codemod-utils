import { parse } from 'node:path';

import type { FilePath, ParsedPath } from '../types/index.js';

/**
 * Parses a file path, similarly to `parse()` from `node:path`,
 * but correctly handles file extensions with more than one `.`,
 * e.g. `.d.ts` and `.css.d.ts`.
 *
 * @param filePath
 *
 * A file path.
 *
 * @return
 *
 * An object with `base`, `dir`, `ext`, and `name`.
 *
 * @example
 *
 * ```ts
 * const filePath = 'src/components/navigation-menu.d.ts';
 * const { base, dir, ext, name } = parseFilePath(filePath);
 *
 * // base -> 'navigation-menu.d.ts'
 * // dir  -> 'src/components'
 * // ext  -> '.d.ts'
 * // name -> 'navigation-menu'
 * ```
 */
export function parseFilePath(filePath: FilePath): ParsedPath {
  // eslint-disable-next-line prefer-const
  let { base, dir, ext, name } = parse(filePath);

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
