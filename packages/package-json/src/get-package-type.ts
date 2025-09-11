import type { PackageJson } from './types.js';

type EmberAddon = Record<string, unknown>;
type PackageName = string;
type PackageType = 'node' | 'v1-addon' | 'v1-app' | 'v2-addon' | 'v2-app';

function getPackageFields(packageJson: PackageJson): {
  dependencies: Set<PackageName>;
  emberAddon: EmberAddon | undefined;
  keywords: string[];
} {
  const dependencies = new Set(
    [
      ...Object.keys(packageJson['dependencies'] ?? {}),
      ...Object.keys(packageJson['devDependencies'] ?? {}),
    ].sort(),
  );

  const emberAddon = packageJson['ember-addon'] as EmberAddon | undefined;

  const keywords = packageJson['keywords'] ?? [];

  return {
    dependencies,
    emberAddon,
    keywords,
  };
}

export function getPackageType(packageJson: PackageJson): PackageType {
  const { dependencies, emberAddon, keywords } = getPackageFields(packageJson);

  if (keywords.includes('ember-addon') && emberAddon) {
    return emberAddon['version'] === 2 ? 'v2-addon' : 'v1-addon';
  }

  if (dependencies.has('ember-source')) {
    return dependencies.has('@embroider/vite') ? 'v2-app' : 'v1-app';
  }

  return 'node';
}
