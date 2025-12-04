import { writeFileSync } from 'node:fs';
import { join } from 'node:path/posix';

import {
  convertToMap,
  convertToObject,
  type PackageJson,
  readPackageJson,
} from '@codemod-utils/package-json';

import type { Options } from '../types/index.js';
import { getVersion } from '../utils/blueprints.js';

function updateDependencies(packageJson: PackageJson, options: Options): void {
  const { codemod } = options;

  const dependencies = convertToMap(packageJson['dependencies']);

  const packagesToInstall = new Set(['@codemod-utils/files', 'yargs']);

  codemod.addons.forEach((identifier) => {
    packagesToInstall.add(`@codemod-utils/${identifier}`);
  });

  Array.from(packagesToInstall).forEach((packageName) => {
    const version = getVersion(packageName);

    dependencies.set(packageName, version);
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  packageJson['dependencies'] = convertToObject(dependencies);
}

function updateDevDependencies(
  packageJson: PackageJson,
  options: Options,
): void {
  const { codemod } = options;

  const devDependencies = convertToMap(packageJson['devDependencies']);

  const packagesToInstall = new Set([
    '@changesets/cli',
    '@changesets/get-github-info',
    '@codemod-utils/tests',
    '@ijlee2-frontend-configs/eslint-config-node',
    '@ijlee2-frontend-configs/prettier',
    '@sondr3/minitest',
    'concurrently',
    'eslint',
    'prettier',
  ]);

  if (codemod.hasTypeScript) {
    packagesToInstall.add('@tsconfig/node20');
    packagesToInstall.add('@tsconfig/strictest');
    packagesToInstall.add('@types/node');
    packagesToInstall.add('@types/yargs');
    packagesToInstall.add('typescript');
  }

  Array.from(packagesToInstall).forEach((packageName) => {
    const version = getVersion(packageName);

    devDependencies.set(packageName, version);
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  packageJson['devDependencies'] = convertToObject(devDependencies);
}

function updatePackageManager(packageJson: PackageJson): void {
  const version = getVersion('pnpm').replace(/^\^/, '');

  packageJson['packageManager'] = `pnpm@${version}`;
}

export function updatePackageJson(options: Options): void {
  const { codemod, projectRoot } = options;

  const packageJson = readPackageJson({
    projectRoot: join(projectRoot, codemod.name),
  });

  updateDependencies(packageJson, options);
  updateDevDependencies(packageJson, options);
  updatePackageManager(packageJson);

  const destination = join(projectRoot, codemod.name, 'package.json');
  const file = JSON.stringify(packageJson, null, 2) + '\n';

  writeFileSync(destination, file, 'utf8');
}
