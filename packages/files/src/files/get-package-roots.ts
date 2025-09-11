import { join } from 'node:path';

import type { Options } from '../types/index.js';
import { findFiles } from './find-files.js';
import { parseFilePath } from './parse-file-path.js';

/**
 * Returns the roots of all packages in a project.
 *
 * @param options
 *
 * An object with `projectRoot`.
 *
 * @example
 *
 * Analyze each package by reading `package.json`.
 *
 * ```ts
 * import { readPackageJson } from '@codemod-utils/package-json';
 *
 * const packageRoots = getPackageRoots({
 *   projectRoot,
 * });
 *
 * packageRoots.forEach((packageRoot) => {
 *   const packageJson = readPackageJson({ projectRoot: packageRoot });
 *
 *   // ...
 * });
 * ```
 */
export function getPackageRoots(
  options: Options & {
    projectRoot: string;
  },
): string[] {
  const { projectRoot } = options;

  const filePaths = findFiles('**/package.json', {
    ignoreList: ['**/{dist,node_modules}/**/*'],
    projectRoot,
  });

  const packageRoots = filePaths.map((filePath) => {
    const { dir } = parseFilePath(filePath);

    return join(projectRoot, dir);
  });

  const isMonorepo = packageRoots.length > 1;

  if (isMonorepo) {
    // Exclude the workspace root
    return packageRoots.filter((packageRoot) => packageRoot !== projectRoot);
  }

  return packageRoots;
}
