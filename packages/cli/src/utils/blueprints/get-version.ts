import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@babel/core', '7.23.2'],
  ['@babel/eslint-parser', '7.22.15'],
  ['@codemod-utils/ast-javascript', '1.2.0'],
  ['@codemod-utils/ast-template', '1.1.0'],
  ['@codemod-utils/blueprints', '1.1.0'],
  ['@codemod-utils/ember-cli-string', '1.1.0'],
  ['@codemod-utils/files', '1.1.0'],
  ['@codemod-utils/json', '1.1.1'],
  ['@codemod-utils/tests', '1.1.1'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node18', '18.2.2'],
  ['@tsconfig/strictest', '2.0.2'],
  ['@types/node', '18.18.7'],
  ['@types/yargs', '17.0.29'],
  ['@typescript-eslint/eslint-plugin', '6.9.0'],
  ['@typescript-eslint/parser', '6.9.0'],
  ['concurrently', '8.2.1'],
  ['eslint', '8.52.0'],
  ['eslint-config-prettier', '9.0.0'],
  ['eslint-import-resolver-typescript', '3.6.1'],
  ['eslint-plugin-import', '2.29.0'],
  ['eslint-plugin-n', '16.2.0'],
  ['eslint-plugin-prettier', '5.0.1'],
  ['eslint-plugin-simple-import-sort', '10.0.0'],
  ['eslint-plugin-typescript-sort-keys', '3.1.0'],
  ['lerna-changelog', '2.2.0'],
  ['prettier', '3.0.3'],
  ['typescript', '5.2.2'],
  ['yargs', '17.7.2'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
