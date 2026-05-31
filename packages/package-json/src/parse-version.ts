type Prefix = '^' | '~' | undefined;

type VersionInfo = {
  major: number;
  minor: number;
  patch: number;
  prefix: Prefix;
};

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
