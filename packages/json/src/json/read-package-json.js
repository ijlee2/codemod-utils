import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function readPackageJson(options) {
  const { projectRoot } = options;

  const filePath = join(projectRoot, 'package.json');

  if (!existsSync(filePath)) {
    throw new SyntaxError(`ERROR: package.json is missing.\n`);
  }

  try {
    const file = readFileSync(filePath, 'utf8');
    const packageJson = JSON.parse(file);

    return packageJson;
  } catch (e) {
    throw new SyntaxError(`ERROR: package.json is not valid. (${e.message})\n`);
  }
}
