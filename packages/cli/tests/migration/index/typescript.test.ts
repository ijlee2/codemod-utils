import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { createCodemod } from '../../../src/migration/index.js';
import {
  inputProject,
  outputProject,
} from '../../fixtures/typescript/index.js';
import { codemodOptions } from '../../helpers/shared-test-setups/typescript.js';

test('migration | index > typescript', function () {
  loadFixture(inputProject, codemodOptions);

  createCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);

  // Check idempotence
  createCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);
});
