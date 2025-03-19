import type { PackageJson, TsConfigJson } from 'type-fest';

type Options = {
  [key: string]: unknown;
  projectRoot: string;
};

export type { Options, PackageJson, TsConfigJson };

export type ValidatedPackageJson = PackageJson &
  Required<Pick<PackageJson, 'name' | 'version'>>;
