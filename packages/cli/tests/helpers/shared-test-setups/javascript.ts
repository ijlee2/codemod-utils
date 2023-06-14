import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
  addons: new Set(),
  hasTypeScript: false,
  name: 'ember-codemod-pod-to-octane',
  projectRoot: 'tmp/javascript',
};

const options: Options = {
  codemod: {
    addons: new Set(),
    hasTypeScript: false,
    name: 'ember-codemod-pod-to-octane',
  },
  projectRoot: 'tmp/javascript',
};

export { codemodOptions, options };
