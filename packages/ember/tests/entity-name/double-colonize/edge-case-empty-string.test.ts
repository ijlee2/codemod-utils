import { assert, test } from '@codemod-utils/tests';

import { doubleColonize } from '../../../src/index.js';

test('entity-name | double-colonize > edge case (empty string)', function () {
  assert.strictEqual(doubleColonize(''), '');
});
