import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { createCodemod } from '../../src/index.js';
import {
  inputProject,
  outputProject,
} from '../fixtures/javascript-with-addons/index.js';
import { codemodOptions } from '../helpers/shared-test-setups/javascript-with-addons.js';

test('index > javascript-with-addons', function () {
  loadFixture(inputProject, codemodOptions);

  createCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);

  // Check idempotence
  createCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);
});
