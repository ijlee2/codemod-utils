import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '2.28.1'],
  ['@changesets/get-github-info', '0.6.0'],
  ['@codemod-utils/ast-javascript', '1.2.15'],
  ['@codemod-utils/ast-template', '1.1.8'],
  ['@codemod-utils/blueprints', '1.1.9'],
  ['@codemod-utils/ember', '2.0.4'],
  ['@codemod-utils/files', '2.0.8'],
  ['@codemod-utils/json', '1.2.0'],
  ['@codemod-utils/tests', '1.1.11'],
  ['@ijlee2-frontend-configs/eslint-config-node', '0.3.0'],
  ['@ijlee2-frontend-configs/prettier', '0.2.3'],
  ['@ijlee2-frontend-configs/typescript', '0.4.0'],
  ['@sondr3/minitest', '0.1.2'],
  ['@types/node', '18.19.82'],
  ['@types/yargs', '17.0.33'],
  ['concurrently', '9.1.2'],
  ['eslint', '9.23.0'],
  ['pnpm', '9.15.9'],
  ['prettier', '3.5.3'],
  ['typescript', '5.8.2'],
  ['yargs', '17.7.2'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
