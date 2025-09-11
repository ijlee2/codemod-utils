import { assert, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > base case', function () {
  const oldFile = '';

  const newFile = toEcma(oldFile);

  assert.strictEqual(newFile, '');

  const newFile2 = toEcma(newFile);

  assert.strictEqual(newFile2, newFile);
});
