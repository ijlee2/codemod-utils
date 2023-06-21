import { assert, test } from '@codemod-utils/tests';

import { camelize } from '../../../src/index.js';

test('utils | ember-cli-string | camelize > edge case (empty string)', function () {
  assert.strictEqual(camelize(''), '');
});
