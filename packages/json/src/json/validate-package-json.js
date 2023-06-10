export function validatePackageJson(packageJson) {
  const { name, version } = packageJson;

  if (!name) {
    throw new SyntaxError(
      'ERROR: package.json is not valid. (Package name is missing.)\n',
    );
  }

  if (name.includes('/')) {
    // eslint-disable-next-line no-unused-vars
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
