import { assert, test } from '@codemod-utils/tests';

import { doubleColonize } from '../../../src/index.js';

test('utils | ember-cli-string | double-colonize > edge case (empty string)', function () {
  assert.strictEqual(doubleColonize(''), '');
});
