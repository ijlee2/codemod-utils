import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@babel/core', '7.24.7'],
  ['@babel/eslint-parser', '7.24.7'],
  ['@changesets/cli', '2.27.7'],
  ['@changesets/get-github-info', '0.6.0'],
  ['@codemod-utils/ast-javascript', '1.2.7'],
  ['@codemod-utils/ast-template', '1.1.3'],
  ['@codemod-utils/blueprints', '1.1.4'],
  ['@codemod-utils/ember-cli-string', '1.1.3'],
  ['@codemod-utils/files', '2.0.3'],
  ['@codemod-utils/json', '1.1.8'],
  ['@codemod-utils/tests', '1.1.6'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node18', '18.2.4'],
  ['@tsconfig/strictest', '2.0.5'],
  ['@types/node', '18.19.39'],
  ['@types/yargs', '17.0.32'],
  ['@typescript-eslint/eslint-plugin', '7.16.0'],
  ['@typescript-eslint/parser', '7.16.0'],
  ['concurrently', '8.2.2'],
  ['eslint', '8.57.0'],
  ['eslint-config-prettier', '9.1.0'],
  ['eslint-import-resolver-typescript', '3.6.1'],
  ['eslint-plugin-import', '2.29.1'],
  ['eslint-plugin-n', '17.9.0'],
  ['eslint-plugin-prettier', '5.1.3'],
  ['eslint-plugin-simple-import-sort', '12.1.1'],
  ['eslint-plugin-typescript-sort-keys', '3.2.0'],
  ['prettier', '3.3.2'],
  ['typescript', '5.5.3'],
  ['yargs', '17.7.2'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
