import { dirname } from 'node:path/posix';
import { fileURLToPath } from 'node:url';

/**
 * Returns where `npx` installs the codemod on the user's machine.
 *
 * @param fileURL
 *
 * Pass the value of `import.meta.url`.
 *
 * @return
 *
 * The installation path.
 *
 * @example
 *
 * To read blueprint files, get the path to the `blueprints` folder.
 *
 * ```ts
 * // src/utils/blueprints/blueprints-root.ts
 * import { join } from 'node:path/posix';
 *
 * const fileURL = import.meta.url;
 *
 * const blueprintsRoot = join(getFilePath(fileURL), '../../blueprints');
 *
 * // '<some/absolute/path>/src/blueprints'
 * ```
 *
 * Afterwards, prepend the file path with `blueprintsRoot`.
 *
 * ```ts
 * import { readFileSync } from 'node:fs';
 * import { join } from 'node:path/posix';
 *
 * const blueprintFilePaths = ['LICENSE.md', 'README.md'];
 *
 * blueprintFilePaths.forEach((blueprintFilePath) => {
 *   const blueprintFile = readFileSync(
 *     join(blueprintsRoot, blueprintFilePath),
 *     'utf8',
 *   );
 * });
 * ```
 */
export function getFilePath(fileURL: string): string {
  const __filename = fileURLToPath(fileURL, { windows: false });
  const __dirname = dirname(__filename);

  return __dirname;
}
