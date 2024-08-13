import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@babel/core', '7.25.2'],
  ['@babel/eslint-parser', '7.25.1'],
  ['@changesets/cli', '2.27.7'],
  ['@changesets/get-github-info', '0.6.0'],
  ['@codemod-utils/ast-javascript', '1.2.8'],
  ['@codemod-utils/ast-template', '1.1.4'],
  ['@codemod-utils/blueprints', '1.1.5'],
  ['@codemod-utils/ember-cli-string', '1.1.4'],
  ['@codemod-utils/files', '2.0.4'],
  ['@codemod-utils/json', '1.1.9'],
  ['@codemod-utils/tests', '1.1.7'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node18', '18.2.4'],
  ['@tsconfig/strictest', '2.0.5'],
  ['@types/node', '18.19.44'],
  ['@types/yargs', '17.0.33'],
  ['@typescript-eslint/eslint-plugin', '8.1.0'],
  ['@typescript-eslint/parser', '8.1.0'],
  ['concurrently', '8.2.2'],
  ['eslint', '8.57.0'],
  ['eslint-config-prettier', '9.1.0'],
  ['eslint-import-resolver-typescript', '3.6.1'],
  ['eslint-plugin-import', '2.29.1'],
  ['eslint-plugin-n', '17.10.2'],
  ['eslint-plugin-prettier', '5.2.1'],
  ['eslint-plugin-simple-import-sort', '12.1.1'],
  ['eslint-plugin-typescript-sort-keys', '3.2.0'],
  ['prettier', '3.3.3'],
  ['typescript', '5.5.4'],
  ['yargs', '17.7.2'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
