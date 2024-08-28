import { assert, test } from '@codemod-utils/tests';

import { classify } from '../../../src/index.js';

test('entity-name | classify > edge case (periods)', function () {
  assert.strictEqual(classify('aa.bb.cc'), 'Aa.Bb.Cc');
  assert.strictEqual(classify('aa.b/b.cc'), 'Aa.BB.Cc');
});
