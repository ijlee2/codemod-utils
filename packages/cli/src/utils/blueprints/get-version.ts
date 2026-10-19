import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['@changesets/cli', '3.0.3'],
  ['@codemod-utils/ast-javascript', '4.3.5'],
  ['@codemod-utils/ast-template', '4.1.2'],
  ['@codemod-utils/ast-template-tag', '2.7.2'],
  ['@codemod-utils/blueprints', '3.2.1'],
  ['@codemod-utils/ember', '4.2.1'],
  ['@codemod-utils/files', '4.1.2'],
  ['@codemod-utils/package-json', '4.1.4'],
  ['@codemod-utils/tests', '3.3.1'],
  ['@codemod-utils/threads', '1.1.2'],
  ['@ijlee2-frontend-configs/changesets', '3.0.4'],
  ['@ijlee2-frontend-configs/oxlint-node', '0.3.2'],
  ['@ijlee2-frontend-configs/prettier', '3.4.4'],
  ['@ijlee2-frontend-configs/typescript', '4.4.1'],
  ['@types/node', '22.20.5'],
  ['@types/yargs', '17.0.35'],
  ['concurrently', '10.0.6'],
  ['oxlint', '1.88.0'],
  ['oxlint-tsgolint', '7.0.2004'],
  ['pnpm', '12.14.0'],
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
