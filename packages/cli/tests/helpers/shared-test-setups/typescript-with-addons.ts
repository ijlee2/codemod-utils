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
  hasTypeScript: true,
  name: '@my-org/my-codemod',
  projectRoot: 'tmp/typescript-with-addons',
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
    hasTypeScript: true,
    name: '@my-org/my-codemod',
  },
  projectRoot: 'tmp/typescript-with-addons',
};

export { codemodOptions, options };
