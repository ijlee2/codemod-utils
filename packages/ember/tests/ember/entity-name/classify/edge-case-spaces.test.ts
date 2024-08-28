import { assert, test } from '@codemod-utils/tests';

import { classify } from '../../../../src/index.js';

test('utils | ember | entity-name | classify > edge case (spaces)', function () {
  assert.strictEqual(classify('my favorite items'), 'MyFavoriteItems');
  assert.strictEqual(classify('My favorite items'), 'MyFavoriteItems');
});
