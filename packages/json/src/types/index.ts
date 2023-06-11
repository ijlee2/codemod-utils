import type { Entries, JsonObject, PackageJson } from 'type-fest';

type Options = {
  [key: string]: unknown;
  projectRoot: string;
};

export type { Entries, JsonObject, Options, PackageJson };
