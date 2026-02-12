type PackageName = string;
type PackageVersion = string;

/**
 * Returns the version that can be installed for a package.
 *
 * Always favors the current version in the user's project (a no-op).
 * Uses the latest version only if the project doesn't depend on the
 * package yet.
 *
 * @param packageName
 *
 * Name of the package.
 *
 * @param options
 *
 * An object with `dependencies` (the current versions in the user's
 * project) and `latestVersions` (the versions to install by default).
 *
 * @return
 *
 * The version to install.
 *
 * @example
 *
 * First, pass `latestVersions` to `decideVersion`.
 *
 * ```ts
 * const latestVersions = new Map([
 *   ['embroider-css-modules', '1.0.0'],
 *   ['webpack', '5.89.0'],
 * ]);
 *
 * // Create a wrapper
 * function getVersion(packageName, options) {
 *   const { dependencies } = options;
 *
 *   return decideVersion(packageName, {
 *     dependencies,
 *     latestVersions,
 *   });
 * }
 * ```
 *
 * Then, pass `dependencies` to `decideVersion`.
 *
 * ```ts
 * const options = {
 *   dependencies: new Map([
 *     ['webpack', '^5.82.0'],
 *   ]),
 * };
 *
 * getVersion('embroider-css-modules', options); // '^1.0.0'
 * getVersion('webpack', options); // '^5.82.0' (no-op)
 * ```
 */
export function decideVersion(
  packageName: PackageName,
  options: {
    dependencies: Map<PackageName, PackageVersion>;
    latestVersions: Map<PackageName, PackageVersion>;
  },
): PackageVersion {
  const { dependencies, latestVersions } = options;

  const installedVersion = dependencies.get(packageName);

  if (installedVersion) {
    return installedVersion;
  }

  const latestVersion = latestVersions.get(packageName);

  if (latestVersion) {
    return `^${latestVersion}`;
  }

  throw new RangeError(
    `ERROR: The latest version of \`${packageName}\` is unknown.`,
  );
}
