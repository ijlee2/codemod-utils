import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { copyFiles } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('copy-files > edge case (from and to are the same)', function () {
  const inputProject = {
    '.editorconfig': 'some code for .editorconfig',
    '.eslintrc.js': 'some code for .eslintrc.js',
    'package.json': 'some code for package.json',
  };

  const outputProject = {
    '.editorconfig': 'some code for .editorconfig',
    '.eslintrc.js': 'some code for .eslintrc.js',
    'package.json': 'some code for package.json',
  };

  loadFixture(inputProject, codemodOptions);

  const filePathMap = new Map([
    ['.eslintrc.js', '.eslintrc.js'],
    ['package.json', 'package.json'],
  ]);

  copyFiles(filePathMap, {
    projectRoot: options.projectRoot,
  });

  assertFixture(outputProject, codemodOptions);
});
