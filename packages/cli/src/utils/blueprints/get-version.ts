import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@babel/core', '7.23.6'],
  ['@babel/eslint-parser', '7.23.3'],
  ['@changesets/cli', '2.27.1'],
  ['@changesets/get-github-info', '0.6.0'],
  ['@codemod-utils/ast-javascript', '1.2.2'],
  ['@codemod-utils/ast-template', '1.1.0'],
  ['@codemod-utils/blueprints', '1.1.0'],
  ['@codemod-utils/ember-cli-string', '1.1.0'],
  ['@codemod-utils/files', '1.1.0'],
  ['@codemod-utils/json', '1.1.3'],
  ['@codemod-utils/tests', '1.1.1'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node18', '18.2.2'],
  ['@tsconfig/strictest', '2.0.2'],
  ['@types/node', '18.19.3'],
  ['@types/yargs', '17.0.32'],
  ['@typescript-eslint/eslint-plugin', '6.14.0'],
  ['@typescript-eslint/parser', '6.14.0'],
  ['concurrently', '8.2.2'],
  ['eslint', '8.56.0'],
  ['eslint-config-prettier', '9.1.0'],
  ['eslint-import-resolver-typescript', '3.6.1'],
  ['eslint-plugin-import', '2.29.1'],
  ['eslint-plugin-n', '16.4.0'],
  ['eslint-plugin-prettier', '5.0.1'],
  ['eslint-plugin-simple-import-sort', '10.0.0'],
  ['eslint-plugin-typescript-sort-keys', '3.1.0'],
  ['prettier', '3.1.1'],
  ['typescript', '5.3.3'],
  ['yargs', '17.7.2'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
