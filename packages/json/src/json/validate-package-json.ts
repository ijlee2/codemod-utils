import type { PackageJson } from '../types/index.js';

export function validatePackageJson(packageJson: PackageJson): void {
  const { name, version } = packageJson;

  if (!name) {
    throw new SyntaxError(
      'ERROR: package.json is not valid. (Package name is missing.)\n',
    );
  }

  if (name.includes('/')) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const [_scope, packageName] = name.split('/');

    if (!packageName) {
      throw new SyntaxError(
        'ERROR: package.json is not valid. (Package name is missing.)\n',
      );
    }
  }

  if (!version) {
    throw new SyntaxError(
      'ERROR: package.json is not valid. (Package version is missing.)\n',
    );
  }
}
