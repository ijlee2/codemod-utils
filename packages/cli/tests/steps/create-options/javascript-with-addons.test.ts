import { assert, test } from '@codemod-utils/tests';

import { createOptions } from '../../../src/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../helpers/shared-test-setups/javascript-with-addons.js';

test('steps | create-options > javascript-with-addons', function () {
  assert.deepStrictEqual(createOptions(codemodOptions), options);
});
