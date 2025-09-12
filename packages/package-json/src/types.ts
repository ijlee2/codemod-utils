import type { PackageJson } from 'type-fest';

type Options = {
  [key: string]: unknown;
  projectRoot: string;
};

type PackageType = 'node' | 'v1-addon' | 'v1-app' | 'v2-addon' | 'v2-app';

type ValidatedPackageJson = PackageJson &
  Required<Pick<PackageJson, 'name' | 'version'>>;

export type { Options, PackageJson, PackageType, ValidatedPackageJson };
