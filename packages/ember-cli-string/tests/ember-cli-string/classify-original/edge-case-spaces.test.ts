import { assert, test } from '@codemod-utils/tests';

import { classifyOriginal } from '../../../src/index.js';

test('utils | ember-cli-string | classify-original > edge case (spaces)', function () {
  assert.strictEqual(classifyOriginal('my favorite items'), 'MyFavoriteItems');
  assert.strictEqual(classifyOriginal('My favorite items'), 'MyFavoriteItems');
});
