import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
  addons: new Set([
    'ast-javascript',
    'ast-template',
    'ast-template-tag',
    'blueprints',
    'ember',
    'package-json',
    'threads',
  ]),
  hasTypeScript: false,
  packageName: 'my-codemod',
  projectRoot: 'tmp/javascript-with-addons',
};

const options: Options = {
  codemod: {
    addons: new Set([
      'ast-javascript',
      'ast-template',
      'ast-template-tag',
      'blueprints',
      'ember',
      'package-json',
      'threads',
    ]),
    hasTypeScript: false,
    name: 'my-codemod',
    unscopedName: 'my-codemod',
  },
  projectRoot: 'tmp/javascript-with-addons',
};

export { codemodOptions, options };
