import { assert, test } from '@codemod-utils/tests';

import { createOptions } from '../../../../src/migration/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../../helpers/shared-test-setups/typescript.js';

test('migration | steps | create-options > typescript', function () {
  assert.deepStrictEqual(createOptions(codemodOptions), options);
});
