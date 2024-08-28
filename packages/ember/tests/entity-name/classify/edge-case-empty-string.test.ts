import { assert, test } from '@codemod-utils/tests';

import { classify } from '../../../src/index.js';

test('entity-name | classify > edge case (empty string)', function () {
  assert.strictEqual(classify(''), '');
});
