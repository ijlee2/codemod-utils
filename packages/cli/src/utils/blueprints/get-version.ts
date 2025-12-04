import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '2.29.8'],
  ['@changesets/get-github-info', '0.7.0'],
  ['@codemod-utils/ast-javascript', '2.1.0'],
  ['@codemod-utils/ast-template', '2.1.0'],
  ['@codemod-utils/ast-template-tag', '1.1.0'],
  ['@codemod-utils/blueprints', '2.1.0'],
  ['@codemod-utils/ember', '3.0.4'],
  ['@codemod-utils/files', '3.1.0'],
  ['@codemod-utils/package-json', '3.3.0'],
  ['@codemod-utils/tests', '2.1.0'],
  ['@ijlee2-frontend-configs/eslint-config-node', '2.3.0'],
  ['@ijlee2-frontend-configs/prettier', '2.3.0'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node20', '20.1.8'],
  ['@tsconfig/strictest', '2.0.8'],
  ['@types/node', '20.19.25'],
  ['@types/yargs', '17.0.35'],
  ['concurrently', '9.2.1'],
  ['eslint', '9.39.1'],
  ['pnpm', '10.24.0'],
  ['prettier', '3.7.4'],
  ['typescript', '5.9.3'],
  ['yargs', '18.0.0'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
