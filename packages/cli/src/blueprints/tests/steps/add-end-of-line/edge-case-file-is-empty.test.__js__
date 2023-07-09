import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { addEndOfLine } from '../../../src/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../helpers/shared-test-setups/sample-project.js';

test('steps | add-end-of-line > edge case (file is empty)', function () {
  const inputProject = {
    'file.txt': '',
  };

  const outputProject = {
    'file.txt': '\n',
  };

  loadFixture(inputProject, codemodOptions);

  addEndOfLine(options);

  assertFixture(outputProject, codemodOptions);
});
