import type { PackageJson } from 'type-fest';

type Options = {
  [key: string]: unknown;
  projectRoot: string;
};

type ValidatedPackageJson = PackageJson &
  Required<Pick<PackageJson, 'name' | 'version'>>;

export type { Options, PackageJson, ValidatedPackageJson };
