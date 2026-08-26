import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '3.0.1'],
  ['@codemod-utils/ast-javascript', '4.3.2'],
  ['@codemod-utils/ast-template', '4.1.0'],
  ['@codemod-utils/ast-template-tag', '2.7.0'],
  ['@codemod-utils/blueprints', '3.2.0'],
  ['@codemod-utils/ember', '4.2.0'],
  ['@codemod-utils/files', '4.1.0'],
  ['@codemod-utils/package-json', '4.1.0'],
  ['@codemod-utils/tests', '3.3.0'],
  ['@codemod-utils/threads', '1.1.0'],
  ['@ijlee2-frontend-configs/changesets', '3.0.1'],
  ['@ijlee2-frontend-configs/eslint-config-node', '4.2.3'],
  ['@ijlee2-frontend-configs/prettier', '3.3.4'],
  ['@tsconfig/node22', '22.0.6'],
  ['@tsconfig/strictest', '2.0.8'],
  ['@types/node', '22.20.1'],
  ['@types/yargs', '17.0.35'],
  ['concurrently', '10.0.5'],
  ['eslint', '10.9.1'],
  ['pnpm', '11.23.0'],
  ['prettier', '3.9.6'],
  ['typescript', '6.0.3'],
  ['yargs', '18.1.0'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
