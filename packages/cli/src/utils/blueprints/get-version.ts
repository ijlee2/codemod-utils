import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@babel/core', '7.26.7'],
  ['@babel/eslint-parser', '7.26.5'],
  ['@changesets/cli', '2.27.12'],
  ['@changesets/get-github-info', '0.6.0'],
  ['@codemod-utils/ast-javascript', '1.2.11'],
  ['@codemod-utils/ast-template', '1.1.7'],
  ['@codemod-utils/blueprints', '1.1.8'],
  ['@codemod-utils/ember', '2.0.3'],
  ['@codemod-utils/files', '2.0.7'],
  ['@codemod-utils/json', '1.1.12'],
  ['@codemod-utils/tests', '1.1.10'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node18', '18.2.4'],
  ['@tsconfig/strictest', '2.0.5'],
  ['@types/node', '18.19.75'],
  ['@types/yargs', '17.0.33'],
  ['@typescript-eslint/eslint-plugin', '8.23.0'],
  ['@typescript-eslint/parser', '8.23.0'],
  ['concurrently', '9.1.2'],
  ['eslint', '8.57.1'],
  ['eslint-config-prettier', '10.0.1'],
  ['eslint-import-resolver-typescript', '3.7.0'],
  ['eslint-plugin-import', '2.31.0'],
  ['eslint-plugin-n', '17.15.1'],
  ['eslint-plugin-prettier', '5.2.3'],
  ['eslint-plugin-simple-import-sort', '12.1.1'],
  ['eslint-plugin-typescript-sort-keys', '3.3.0'],
  ['pnpm', '9.15.5'],
  ['prettier', '3.4.2'],
  ['typescript', '5.7.3'],
  ['yargs', '17.7.2'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
