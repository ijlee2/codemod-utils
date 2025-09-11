import { assert, loadFixture, test } from '@codemod-utils/tests';

import { findFiles } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('find-files > edge case (specified folder does not exist)', function () {
  const inputProject = {
    tests: {},
  };

  loadFixture(inputProject, codemodOptions);

  const filePaths = findFiles('tests/dummy/**/*.{js,ts}', {
    projectRoot: options.projectRoot,
  });

  assert.deepStrictEqual(filePaths, []);
});
