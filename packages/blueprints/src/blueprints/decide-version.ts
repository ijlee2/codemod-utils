type PackageName = string;
type PackageVersion = string;

type Options = {
  dependencies: Map<PackageName, PackageVersion>;
  latestVersions: Map<PackageName, PackageVersion>;
};

export function decideVersion(packageName: PackageName, options: Options): PackageVersion {
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
    `ERROR: The latest version of \`${packageName}\` is unknown.\n`,
  );
}
