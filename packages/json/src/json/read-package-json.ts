import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Options, PackageJson } from '../types/index.js';

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
