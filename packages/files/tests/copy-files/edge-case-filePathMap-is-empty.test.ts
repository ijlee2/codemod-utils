import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { copyFiles, type FilePath } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('copy-files > edge case (filePathMap is empty)', function () {
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

  const filePathMap = new Map<FilePath, FilePath>();

  copyFiles(filePathMap, {
    projectRoot: options.projectRoot,
  });

  assertFixture(outputProject, codemodOptions);
});
