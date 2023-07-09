import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { addEndOfLine } from '../../../src/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../helpers/shared-test-setups/sample-project.js';

test('steps | add-end-of-line > base case', function () {
  const inputProject = {
    'file.txt': 'Hello world!',
  };

  const outputProject = {
    'file.txt': 'Hello world!\n',
  };

  loadFixture(inputProject, codemodOptions);

  addEndOfLine(options);

  assertFixture(outputProject, codemodOptions);
});
