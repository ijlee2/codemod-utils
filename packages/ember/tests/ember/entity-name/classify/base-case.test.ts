import { assert, test } from '@codemod-utils/tests';

import { classify } from '../../../../src/index.js';

test('utils | ember | entity-name | classify > base case', function () {
  assert.strictEqual(classify('innerHTML'), 'InnerHTML');
  assert.strictEqual(classify('action_name'), 'ActionName');
  assert.strictEqual(classify('css-class-name'), 'CssClassName');
});
