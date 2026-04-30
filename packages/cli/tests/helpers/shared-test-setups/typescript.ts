import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
  addons: new Set(),
  hasTypeScript: true,
  packageName: '@my-org/my-codemod',
  projectRoot: 'tmp/typescript',
};

const options: Options = {
  codemod: {
    addons: new Set(),
    hasTypeScript: true,
    name: '@my-org/my-codemod',
    unscopedName: 'my-codemod',
  },
  projectRoot: 'tmp/typescript',
};

export { codemodOptions, options };
