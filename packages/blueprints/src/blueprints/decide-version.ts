export function decideVersion(packageName, { dependencies, latestVersions }) {
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
