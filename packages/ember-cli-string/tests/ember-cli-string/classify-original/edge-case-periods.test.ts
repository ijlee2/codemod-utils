import { assert, test } from '@codemod-utils/tests';

import { classifyOriginal } from '../../../src/index.js';

test('utils | ember-cli-string | classify-original > edge case (periods)', function () {
  assert.strictEqual(classifyOriginal('aa.bb.cc'), 'Aa.Bb.Cc');
  assert.strictEqual(classifyOriginal('aa.b/b.cc'), 'Aa.B/b.Cc');
});
