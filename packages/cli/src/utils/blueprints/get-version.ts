import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '2.29.2'],
  ['@changesets/get-github-info', '0.6.0'],
  ['@codemod-utils/ast-javascript', '1.2.15'],
  ['@codemod-utils/ast-template', '1.1.8'],
  ['@codemod-utils/blueprints', '1.1.9'],
  ['@codemod-utils/ember', '2.0.4'],
  ['@codemod-utils/files', '2.0.8'],
  ['@codemod-utils/json', '1.2.0'],
  ['@codemod-utils/tests', '1.1.11'],
  ['@ijlee2-frontend-configs/eslint-config-node', '0.4.1'],
  ['@ijlee2-frontend-configs/prettier', '0.2.4'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node18', '18.2.4'],
  ['@tsconfig/strictest', '2.0.5'],
  ['@types/node', '18.19.87'],
  ['@types/yargs', '17.0.33'],
  ['concurrently', '9.1.2'],
  ['eslint', '9.25.1'],
  ['pnpm', '9.15.9'],
  ['prettier', '3.5.3'],
  ['typescript', '5.8.3'],
  ['yargs', '17.7.2'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
