import { assert, test } from '@codemod-utils/tests';

import { createOptions } from '../../../../src/migration/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../../helpers/shared-test-setups/typescript-with-addons.js';

test('migration | steps | create-options > typescript-with-addons', function () {
  assert.deepStrictEqual(createOptions(codemodOptions), options);
});
