import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '2.29.5'],
  ['@changesets/get-github-info', '0.6.0'],
  ['@codemod-utils/ast-javascript', '2.0.4'],
  ['@codemod-utils/ast-template', '2.0.1'],
  ['@codemod-utils/blueprints', '2.0.1'],
  ['@codemod-utils/ember', '3.0.1'],
  ['@codemod-utils/files', '3.0.3'],
  ['@codemod-utils/json', '2.0.2'],
  ['@codemod-utils/tests', '2.0.2'],
  ['@ijlee2-frontend-configs/eslint-config-node', '2.1.0'],
  ['@ijlee2-frontend-configs/prettier', '2.1.0'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node20', '20.1.6'],
  ['@tsconfig/strictest', '2.0.5'],
  ['@types/node', '20.19.9'],
  ['@types/yargs', '17.0.33'],
  ['concurrently', '9.2.0'],
  ['eslint', '9.32.0'],
  ['pnpm', '10.13.1'],
  ['prettier', '3.6.2'],
  ['typescript', '5.8.3'],
  ['yargs', '18.0.0'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
