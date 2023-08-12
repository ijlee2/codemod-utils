import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@babel/core', '7.22.10'],
  ['@babel/eslint-parser', '7.22.10'],
  ['@codemod-utils/ast-javascript', '0.3.3'],
  ['@codemod-utils/ast-template', '0.3.1'],
  ['@codemod-utils/blueprints', '0.2.1'],
  ['@codemod-utils/ember-cli-string', '0.1.1'],
  ['@codemod-utils/files', '0.5.2'],
  ['@codemod-utils/json', '0.4.1'],
  ['@codemod-utils/tests', '0.3.0'],
  ['@sondr3/minitest', '0.1.1'],
  ['@tsconfig/esm', '1.0.4'],
  ['@tsconfig/node16', '16.1.0'],
  ['@tsconfig/strictest', '2.0.1'],
  ['@types/node', '16.18.40'],
  ['@types/yargs', '17.0.24'],
  ['@typescript-eslint/eslint-plugin', '6.3.0'],
  ['@typescript-eslint/parser', '6.3.0'],
  ['concurrently', '8.2.0'],
  ['eslint', '8.47.0'],
  ['eslint-config-prettier', '9.0.0'],
  ['eslint-import-resolver-typescript', '3.6.0'],
  ['eslint-plugin-import', '2.28.0'],
  ['eslint-plugin-n', '16.0.1'],
  ['eslint-plugin-prettier', '5.0.0'],
  ['eslint-plugin-simple-import-sort', '10.0.0'],
  ['eslint-plugin-typescript-sort-keys', '2.3.0'],
  ['lerna-changelog', '2.2.0'],
  ['prettier', '3.0.1'],
  ['typescript', '5.1.6'],
  ['yargs', '17.7.2'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
