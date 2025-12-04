import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { copyFiles } from '../../src/index.js';
import { codemodOptions, options } from '../helpers/index.js';

test('copy-files > base case', function () {
  const inputProject = {
    '.editorconfig': 'some code for .editorconfig',
    '.eslintrc.js': 'some code for .eslintrc.js',
    'package.json': 'some code for package.json',
  };

  const outputProject = {
    'ember-container-query': {
      '.eslintrc.js': 'some code for .eslintrc.js',
      'package.json': 'some code for package.json',
    },

    '.editorconfig': 'some code for .editorconfig',
    '.eslintrc.js': 'some code for .eslintrc.js',
    'package.json': 'some code for package.json',
  };

  loadFixture(inputProject, codemodOptions);

  const filePathMap = new Map([
    ['.eslintrc.js', 'ember-container-query/.eslintrc.js'],
    ['package.json', 'ember-container-query/package.json'],
  ]);

  copyFiles(filePathMap, {
    projectRoot: options.projectRoot,
  });

  assertFixture(outputProject, codemodOptions);
});
