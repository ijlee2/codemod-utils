import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { createFiles } from '../../../src/index.js';
import { codemodOptions, options } from '../../shared-test-setups/index.js';

test('files | create-files > edge case (mapping is empty)', function () {
  const inputProject = {};

  const outputProject = {};

  loadFixture(inputProject, codemodOptions);

  const fileMap = new Map();

  createFiles(fileMap, options);

  assertFixture(outputProject, codemodOptions);
});
