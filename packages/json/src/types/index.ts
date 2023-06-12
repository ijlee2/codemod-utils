import type { PackageJson, TsConfigJson } from 'type-fest';

type Options = {
  [key: string]: unknown;
  projectRoot: string;
};

export type { Options, PackageJson, TsConfigJson };
