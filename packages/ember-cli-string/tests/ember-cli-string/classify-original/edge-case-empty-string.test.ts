import { assert, test } from '@codemod-utils/tests';

import { classifyOriginal } from '../../../src/index.js';

test('utils | ember-cli-string | classify-original > edge case (empty string)', function () {
  assert.strictEqual(classifyOriginal(''), '');
});
