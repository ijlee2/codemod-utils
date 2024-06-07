import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { createCodemod } from '../../src/index.js';
// eslint-disable-next-line n/no-missing-import
import { inputProject, outputProject } from '../fixtures/typescript/index.js';
import { codemodOptions } from '../helpers/shared-test-setups/typescript.js';

test('migration | index > typescript', function () {
  loadFixture(inputProject, codemodOptions);

  createCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);

  // Check idempotence
  createCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);
});
