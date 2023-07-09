import type { CodemodOptions, Options } from '../../types/index.js';

export function createOptions(codemodOptions: CodemodOptions): Options {
  const { addons, hasTypeScript, name, projectRoot } = codemodOptions;

  return {
    codemod: {
      addons,
      hasTypeScript,
      name,
    },
    projectRoot,
  };
}
