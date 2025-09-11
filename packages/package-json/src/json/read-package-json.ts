import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Options, PackageJson } from '../types/index.js';

/**
 * Reads `package.json` and returns the parsed JSON.
 *
 * @param options
 *
 * An object with `projectRoot`.
 *
 * @return
 *
 * A JSON that represents `package.json`.
 *
 * @example
 *
 * Check if a project has `typescript` as a dependency.
 *
 * ```ts
 * const { dependencies, devDependencies } = readPackageJson({
 *   projectRoot,
 * });
 *
 * const projectDependencies = new Map([
 *   ...Object.entries(dependencies ?? {}),
 *   ...Object.entries(devDependencies ?? {}),
 * ]);
 *
 * const hasTypeScript = projectDependencies.has('typescript');
 * ```
 */
export function readPackageJson(options: Options): PackageJson {
  const { projectRoot } = options;

  const filePath = join(projectRoot, 'package.json');

  if (!existsSync(filePath)) {
    throw new SyntaxError(`ERROR: package.json is missing.\n`);
  }

  try {
    const file = readFileSync(filePath, 'utf8');

    return JSON.parse(file) as PackageJson;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new SyntaxError(
        `ERROR: package.json is not valid. (${error.message})\n`,
      );
    }

    throw error;
  }
}
