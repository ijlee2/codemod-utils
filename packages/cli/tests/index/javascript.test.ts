import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { createCodemod } from '../../src/index.js';
import { inputProject, outputProject } from '../fixtures/javascript/index.js';
import { codemodOptions } from '../helpers/shared-test-setups/javascript.js';

test('migration | index > javascript', function () {
  loadFixture(inputProject, codemodOptions);

  createCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);

  // Check idempotence
  createCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);
});
