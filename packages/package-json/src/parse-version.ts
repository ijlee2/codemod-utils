type Prefix = '^' | '~' | undefined;

type VersionInfo = {
  major: number;
  minor: number;
  patch: number;
  prefix: Prefix;
};

/**
 * Parses a package version that adheres to SemVer (semantic versioning).
 *
 * @param version
 *
 * A string that, in most cases, may have the prefix `^` or `~`, followed by
 * the version core `<major>.<minor>.<patch>`.
 *
 * @return
 *
 * An object with keys `major`, `minor`, `patch`, and `prefix` if `version`
 * could be parsed. `undefined` otherwise.
 *
 * @example
 *
 * Do something when the package version is below `6.8.0`.
 *
 * ```ts
 * const { major, minor } = parseVersion('^6.12.0');
 *
 * if (major < 6 || (major === 6 && minor < 8)) {
 *   // Do something
 * }
 * ```
 * ```
 */
export function parseVersion(
  version: string | undefined,
): VersionInfo | undefined {
  if (version === undefined) {
    return undefined;
  }

  const regex = new RegExp(/^(\^|~)?(\d+(\.\d+)?(\.\d+)?).*/);
  const matches = version.match(regex);

  if (!matches) {
    return undefined;
  }

  const prefix = matches[1] as Prefix;

  const [majorVersion, minorVersion, patchVersion] = matches[2]!.split('.') as [
    string,
    string | undefined,
    string | undefined,
  ];

  return {
    major: Number(majorVersion),
    minor: Number(minorVersion ?? 0),
    patch: Number(patchVersion ?? 0),
    prefix,
  };
}
