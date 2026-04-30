import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
  addons: new Set(),
  hasTypeScript: false,
  packageName: 'my-codemod',
  projectRoot: 'tmp/javascript',
};

const options: Options = {
  codemod: {
    addons: new Set(),
    hasTypeScript: false,
    name: 'my-codemod',
    unscopedName: 'my-codemod',
  },
  projectRoot: 'tmp/javascript',
};

export { codemodOptions, options };
