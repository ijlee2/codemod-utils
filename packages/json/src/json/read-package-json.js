import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function validate({ name, version }) {
  if (!name) {
    throw new SyntaxError('Package name is missing.');
  }

  if (name.includes('/')) {
    // eslint-disable-next-line no-unused-vars
    const [_scope, packageName] = name.split('/');

    if (!packageName) {
      throw new SyntaxError('Package name is missing.');
    }
  }

  if (!version) {
    throw new SyntaxError('Package version is missing.');
  }
}

export function readPackageJson(codemodOptions) {
  const { projectRoot } = codemodOptions;

  try {
    const file = readFileSync(join(projectRoot, 'package.json'), 'utf8');
    const packageJson = JSON.parse(file);

    validate(packageJson);

    return packageJson;
  } catch (e) {
    throw new SyntaxError(
      `ERROR: package.json is missing or is not valid. (${e.message})\n`,
    );
  }
}
