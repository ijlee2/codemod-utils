import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '2.29.4'],
  ['@changesets/get-github-info', '0.6.0'],
  ['@codemod-utils/ast-javascript', '2.0.2'],
  ['@codemod-utils/ast-template', '2.0.1'],
  ['@codemod-utils/blueprints', '2.0.1'],
  ['@codemod-utils/ember', '3.0.1'],
  ['@codemod-utils/files', '3.0.2'],
  ['@codemod-utils/json', '2.0.2'],
  ['@codemod-utils/tests', '2.0.1'],
  ['@ijlee2-frontend-configs/eslint-config-node', '1.2.0'],
  ['@ijlee2-frontend-configs/prettier', '1.0.0'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node20', '20.1.5'],
  ['@tsconfig/strictest', '2.0.5'],
  ['@types/node', '20.17.54'],
  ['@types/yargs', '17.0.33'],
  ['concurrently', '9.1.2'],
  ['eslint', '9.27.0'],
  ['pnpm', '9.15.9'],
  ['prettier', '3.5.3'],
  ['typescript', '5.8.3'],
  ['yargs', '18.0.0'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
