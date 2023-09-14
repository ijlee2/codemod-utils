import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@babel/core', '7.22.17'],
  ['@babel/eslint-parser', '7.22.15'],
  ['@codemod-utils/ast-javascript', '1.0.0'],
  ['@codemod-utils/ast-template', '1.0.0'],
  ['@codemod-utils/blueprints', '1.0.0'],
  ['@codemod-utils/ember-cli-string', '1.0.0'],
  ['@codemod-utils/files', '1.0.0'],
  ['@codemod-utils/json', '1.0.0'],
  ['@codemod-utils/tests', '1.0.0'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node18', '18.2.2'],
  ['@tsconfig/strictest', '2.0.2'],
  ['@types/node', '18.17.15'],
  ['@types/yargs', '17.0.24'],
  ['@typescript-eslint/eslint-plugin', '6.7.0'],
  ['@typescript-eslint/parser', '6.7.0'],
  ['concurrently', '8.2.1'],
  ['eslint', '8.49.0'],
  ['eslint-config-prettier', '9.0.0'],
  ['eslint-import-resolver-typescript', '3.6.0'],
  ['eslint-plugin-import', '2.28.1'],
  ['eslint-plugin-n', '16.1.0'],
  ['eslint-plugin-prettier', '5.0.0'],
  ['eslint-plugin-simple-import-sort', '10.0.0'],
  ['eslint-plugin-typescript-sort-keys', '3.0.0'],
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
