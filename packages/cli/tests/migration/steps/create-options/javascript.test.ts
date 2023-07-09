import { assert, test } from '@codemod-utils/tests';

import { createOptions } from '../../../../src/migration/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../../helpers/shared-test-setups/javascript.js';

test('migration | steps | create-options > javascript', function () {
  assert.deepStrictEqual(createOptions(codemodOptions), options);
});
