import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
  addons: new Set(),
  hasTypeScript: true,
  name: 'my-codemod',
  projectRoot: 'tmp/typescript',
};

const options: Options = {
  codemod: {
    addons: new Set(),
    hasTypeScript: true,
    name: 'my-codemod',
  },
  projectRoot: 'tmp/typescript',
};

export { codemodOptions, options };
