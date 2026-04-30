import type { PackageJson, ValidatedPackageJson } from './types.js';

function unscope(packageName: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_scope, unscopedPackageName] = packageName.split('/');

  return unscopedPackageName;
}

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
      'ERROR: package.json is not valid. (Package name is missing.)',
    );
  }

  if (name.includes('/')) {
    const unscopedName = unscope(name);

    if (!unscopedName) {
      throw new SyntaxError(
        'ERROR: package.json is not valid. (Package name is missing.)',
      );
    }
  }

  if (!version) {
    throw new SyntaxError(
      'ERROR: package.json is not valid. (Package version is missing.)',
    );
  }
}
