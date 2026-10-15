import type { CodemodOptions, Options } from '../types/index.js';

function unscope(packageName: string): string {
  // oxlint-disable-next-line typescript/no-unused-vars
  const [_scope, unscopedPackageName] = packageName.split('/');

  return unscopedPackageName ?? packageName;
}

export function createOptions(codemodOptions: CodemodOptions): Options {
  const { addons, hasTypeScript, packageName, projectRoot } = codemodOptions;

  return {
    codemod: {
      addons,
      hasTypeScript,
      name: packageName,
      unscopedName: unscope(packageName),
    },
    projectRoot,
  };
}
