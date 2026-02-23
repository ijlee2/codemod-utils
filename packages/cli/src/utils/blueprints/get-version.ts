import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '2.29.8'],
  ['@codemod-utils/ast-javascript', '3.0.0'],
  ['@codemod-utils/ast-template', '3.0.0'],
  ['@codemod-utils/ast-template-tag', '2.0.0'],
  ['@codemod-utils/blueprints', '3.0.0'],
  ['@codemod-utils/ember', '4.0.0'],
  ['@codemod-utils/files', '4.0.0'],
  ['@codemod-utils/package-json', '4.0.0'],
  ['@codemod-utils/tests', '3.0.0'],
  ['@ijlee2-frontend-configs/changesets', '2.0.0'],
  ['@ijlee2-frontend-configs/eslint-config-node', '3.0.0'],
  ['@ijlee2-frontend-configs/prettier', '3.0.0'],
  ['@sondr3/minitest', '0.1.2'],
  ['@tsconfig/node22', '22.0.5'],
  ['@tsconfig/strictest', '2.0.8'],
  ['@types/node', '22.19.11'],
  ['@types/yargs', '17.0.35'],
  ['concurrently', '9.2.1'],
  ['eslint', '9.39.2'],
  ['pnpm', '10.30.1'],
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
