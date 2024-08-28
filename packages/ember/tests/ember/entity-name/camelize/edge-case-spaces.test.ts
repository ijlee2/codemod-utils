import { assert, test } from '@codemod-utils/tests';

import { camelize } from '../../../../src/index.js';

test('utils | ember | entity-name | camelize > edge case (spaces)', function () {
  assert.strictEqual(camelize('my favorite items'), 'myFavoriteItems');
  assert.strictEqual(camelize('My favorite items'), 'myFavoriteItems');
});
