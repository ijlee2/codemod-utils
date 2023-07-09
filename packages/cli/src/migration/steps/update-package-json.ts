import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  convertToMap,
  convertToObject,
  type PackageJson,
  readPackageJson,
} from '@codemod-utils/json';

import type { Options } from '../../types/index.js';
import { getVersion } from '../../utils/blueprints.js';

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

  packageJson['dependencies'] = convertToObject(dependencies);
}

function updateDevDependencies(
  packageJson: PackageJson,
  options: Options,
): void {
  const { codemod } = options;

  const devDependencies = convertToMap(packageJson['devDependencies']);

  const packagesToInstall = new Set([
    '@babel/core',
    '@babel/eslint-parser',
    '@codemod-utils/tests',
    'concurrently',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-import',
    'eslint-plugin-n',
    'eslint-plugin-prettier',
    'eslint-plugin-simple-import-sort',
    'lerna-changelog',
    'prettier',
  ]);

  if (codemod.hasTypeScript) {
    packagesToInstall.delete('@babel/eslint-parser');
    packagesToInstall.add('@tsconfig/esm');
    packagesToInstall.add('@tsconfig/node16');
    packagesToInstall.add('@tsconfig/strictest');
    packagesToInstall.add('@types/node');
    packagesToInstall.add('@types/yargs');
    packagesToInstall.add('@typescript-eslint/eslint-plugin');
    packagesToInstall.add('@typescript-eslint/parser');
    packagesToInstall.add('eslint-import-resolver-typescript');
    packagesToInstall.add('eslint-plugin-typescript-sort-keys');
    packagesToInstall.add('typescript');
  }

  Array.from(packagesToInstall).forEach((packageName) => {
    const version = getVersion(packageName);

    devDependencies.set(packageName, version);
  });

  // Pin @sondr3/minitest to v0.1.1 (to support Node 16)
  devDependencies.set('@sondr3/minitest', '0.1.1');

  packageJson['devDependencies'] = convertToObject(devDependencies);
}

export function updatePackageJson(options: Options): void {
  const { codemod, projectRoot } = options;

  const packageJson = readPackageJson({
    projectRoot: join(projectRoot, codemod.name),
  });

  updateDependencies(packageJson, options);
  updateDevDependencies(packageJson, options);

  const destination = join(projectRoot, codemod.name, 'package.json');
  const file = JSON.stringify(packageJson, null, 2) + '\n';

  writeFileSync(destination, file, 'utf8');
}
