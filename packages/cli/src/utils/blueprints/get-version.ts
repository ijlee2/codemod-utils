import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '2.29.7'],
  ['@changesets/get-github-info', '0.6.0'],
  ['@codemod-utils/ast-javascript', '2.0.6'],
  ['@codemod-utils/ast-template', '2.0.2'],
  ['@codemod-utils/ast-template-tag', '0.3.0'],
  ['@codemod-utils/blueprints', '2.0.2'],
  ['@codemod-utils/ember', '3.0.2'],
  ['@codemod-utils/files', '3.0.4'],
  ['@codemod-utils/json', '2.0.3'],
  ['@codemod-utils/tests', '2.0.3'],
  ['@ijlee2-frontend-configs/eslint-config-node', '2.1.2'],
  ['@ijlee2-frontend-configs/prettier', '2.1.1'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node20', '20.1.6'],
  ['@tsconfig/strictest', '2.0.5'],
  ['@types/node', '20.19.13'],
  ['@types/yargs', '17.0.33'],
  ['concurrently', '9.2.1'],
  ['eslint', '9.35.0'],
  ['pnpm', '10.15.1'],
  ['prettier', '3.6.2'],
  ['typescript', '5.9.2'],
  ['yargs', '18.0.0'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
