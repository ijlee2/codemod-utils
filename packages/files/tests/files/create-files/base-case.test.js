import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { createFiles } from '../../../src/index.js';
import { codemodOptions, options } from '../../shared-test-setups/index.js';

test('files | create-files > base case', function () {
  const inputProject = {};

  const outputProject = {
    'ember-container-query': {
      'unpublished-development-types': {
        'index.d.ts': 'some code for index.d.ts',
      },

      'rollup.config.mjs': 'some code for rollup.config.mjs',
    },

    'package.json': 'some code for package.json',
  };

  loadFixture(inputProject, codemodOptions);

  const fileMap = new Map([
    [
      'ember-container-query/unpublished-development-types/index.d.ts',
      'some code for index.d.ts',
    ],
    [
      'ember-container-query/rollup.config.mjs',
      'some code for rollup.config.mjs',
    ],
    ['package.json', 'some code for package.json'],
  ]);

  createFiles(fileMap, options);

  assertFixture(outputProject, codemodOptions);
});
