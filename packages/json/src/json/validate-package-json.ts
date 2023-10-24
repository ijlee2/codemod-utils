import type { PackageJson } from '../types/index.js';

/**
 * Check if the fields `name` and `version` exist, in the sense that
 * their values are a non-empty string.
 *
 * You may still need the non-null assertion operator `!`, to
 * tell TypeScript that `name` and `version` are not `undefined`.
 *
 * @param packageJson
 *
 * A JSON that represents `package.json`.
 *
 * @example
 *
 * ```ts
 * const packageJson = readPackageJson({
 *   projectRoot,
 * });
 *
 * validatePackageJson(packageJson);
 *
 * const { name, version } = packageJson;
 * ```
 */
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
