import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
  addons: new Set([
    'ast-javascript',
    'ast-template',
    'blueprints',
    'ember-cli-string',
    'json',
  ]),
  hasTypeScript: false,
  name: 'ember-codemod-args-to-signature',
  projectRoot: 'tmp/javascript-with-addons',
};

const options: Options = {
  codemod: {
    addons: new Set([
      'ast-javascript',
      'ast-template',
      'blueprints',
      'ember-cli-string',
      'json',
    ]),
    hasTypeScript: false,
    name: 'ember-codemod-args-to-signature',
  },
  projectRoot: 'tmp/javascript-with-addons',
};

export { codemodOptions, options };
