import type { PackageJson, ValidatedPackageJson } from '../types/index.js';

/**
 * (Type-)Checks that the fields `name` and `version` exist, in the
 * sense that their values are a non-empty string.
 *
 * @param packageJson
 *
 * A JSON that represents `package.json`.
 *
 * @example
 *
 * ```ts
 * const packageJson = readPackageJson({ projectRoot });
 *
 * validatePackageJson(packageJson);
 *
 * // Both guaranteed to be `string` (not `undefined`)
 * const { name, version } = packageJson;
 * ```
 */
export function validatePackageJson(
  packageJson: PackageJson,
): asserts packageJson is ValidatedPackageJson {
  const { name, version } = packageJson;

  if (!name) {
    throw new SyntaxError(
      'ERROR: package.json is not valid. (Package name is missing.)\n',
    );
  }

  if (name.includes('/')) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
