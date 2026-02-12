import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '2.29.8'],
  ['@codemod-utils/ast-javascript', '2.1.6'],
  ['@codemod-utils/ast-template', '2.1.5'],
  ['@codemod-utils/ast-template-tag', '1.2.4'],
  ['@codemod-utils/blueprints', '2.1.5'],
  ['@codemod-utils/ember', '3.0.9'],
  ['@codemod-utils/files', '3.2.8'],
  ['@codemod-utils/package-json', '3.3.7'],
  ['@codemod-utils/tests', '2.2.7'],
  ['@ijlee2-frontend-configs/changesets', '1.0.2'],
  ['@ijlee2-frontend-configs/eslint-config-node', '2.4.1'],
  ['@ijlee2-frontend-configs/prettier', '2.4.1'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node20', '20.1.9'],
  ['@tsconfig/strictest', '2.0.8'],
  ['@types/node', '20.19.33'],
  ['@types/yargs', '17.0.35'],
  ['concurrently', '9.2.1'],
  ['eslint', '9.39.2'],
  ['pnpm', '10.28.2'],
  ['prettier', '3.8.1'],
  ['typescript', '5.9.3'],
  ['yargs', '18.0.0'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
