import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@babel/core', '7.22.8'],
  ['@babel/eslint-parser', '7.22.7'],
  ['@codemod-utils/ast-javascript', '0.3.0'],
  ['@codemod-utils/ast-template', '0.3.0'],
  ['@codemod-utils/blueprints', '0.2.1'],
  ['@codemod-utils/ember-cli-string', '0.1.0'],
  ['@codemod-utils/files', '0.5.1'],
  ['@codemod-utils/json', '0.3.2'],
  ['@codemod-utils/tests', '0.2.4'],
  ['@sondr3/minitest', '0.1.1'],
  ['@tsconfig/esm', '1.0.4'],
  ['@tsconfig/node16', '16.1.0'],
  ['@tsconfig/strictest', '2.0.1'],
  ['@types/node', '16.11.7'],
  ['@types/yargs', '17.0.24'],
  ['@typescript-eslint/eslint-plugin', '5.61.0'],
  ['@typescript-eslint/parser', '5.61.0'],
  ['concurrently', '8.2.0'],
  ['eslint', '8.44.0'],
  ['eslint-config-prettier', '8.8.0'],
  ['eslint-import-resolver-typescript', '3.5.5'],
  ['eslint-plugin-import', '2.27.5'],
  ['eslint-plugin-n', '16.0.1'],
  ['eslint-plugin-prettier', '4.2.1'],
  ['eslint-plugin-simple-import-sort', '10.0.0'],
  ['eslint-plugin-typescript-sort-keys', '2.3.0'],
  ['lerna-changelog', '2.2.0'],
  ['prettier', '2.8.8'],
  ['typescript', '5.1.6'],
  ['yargs', '17.7.2'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
