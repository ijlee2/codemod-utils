import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '3.0.3'],
  ['@codemod-utils/ast-javascript', '4.3.4'],
  ['@codemod-utils/ast-template', '4.1.1'],
  ['@codemod-utils/ast-template-tag', '2.7.1'],
  ['@codemod-utils/blueprints', '3.2.0'],
  ['@codemod-utils/ember', '4.2.0'],
  ['@codemod-utils/files', '4.1.1'],
  ['@codemod-utils/package-json', '4.1.3'],
  ['@codemod-utils/tests', '3.3.0'],
  ['@codemod-utils/threads', '1.1.1'],
  ['@ijlee2-frontend-configs/changesets', '3.0.3'],
  ['@ijlee2-frontend-configs/eslint-config-node', '4.8.0'],
  ['@ijlee2-frontend-configs/prettier', '3.4.2'],
  ['@ijlee2-frontend-configs/typescript', '4.4.0'],
  ['@types/node', '22.20.5'],
  ['@types/yargs', '17.0.35'],
  ['concurrently', '10.0.6'],
  ['eslint', '10.12.0'],
  ['pnpm', '12.11.2'],
  ['prettier', '3.9.10'],
  ['typescript', '6.0.3'],
  ['yargs', '18.2.0'],
]);

export function getVersion(packageName: string): string {
  return decideVersion(packageName, {
    dependencies: new Map(),
    latestVersions,
  });
}
