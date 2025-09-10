import { assert, test } from '@codemod-utils/tests';

import { preprocess } from '../../src/index.js';

test('preprocess > base case', function () {
  const oldFile = '';

  const { javascript, templateTags } = preprocess(oldFile);

  assert.strictEqual(javascript, '');

  assert.deepStrictEqual(templateTags, []);
});
