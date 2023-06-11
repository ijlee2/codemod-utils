import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { PackageJson } from 'type-fest';

type Options = {
  [key: string]: unknown;
  projectRoot: string;
};

export function readPackageJson(options: Options): PackageJson {
  const { projectRoot } = options;

  const filePath = join(projectRoot, 'package.json');

  if (!existsSync(filePath)) {
    throw new SyntaxError(`ERROR: package.json is missing.\n`);
  }

  try {
    const file = readFileSync(filePath, 'utf8');
    const packageJson: PackageJson = JSON.parse(file);

    return packageJson;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new SyntaxError(
        `ERROR: package.json is not valid. (${error.message})\n`,
      );
    }

    throw error;
  }
}
