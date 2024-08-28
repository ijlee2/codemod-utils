import { assert, test } from '@codemod-utils/tests';

import { camelize } from '../../../src/index.js';

test('entity-name | camelize > edge case (empty string)', function () {
  assert.strictEqual(camelize(''), '');
});
