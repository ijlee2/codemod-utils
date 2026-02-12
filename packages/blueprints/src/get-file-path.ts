import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Returns where the codemod ends up being installed on the user's machine.
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
 * import { join } from 'node:path';
 *
 * const fileURL = import.meta.url;
 *
 * export const blueprintsRoot = join(getFilePath(fileURL), '../../blueprints');
 * ```
 *
 * Afterwards, prepend the file path with `blueprintsRoot`.
 *
 * ```ts
 * import { readFileSync } from 'node:fs';
 * import { join } from 'node:path';
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
  const __filename = fileURLToPath(fileURL);
  const __dirname = dirname(__filename);

  return __dirname;
}
