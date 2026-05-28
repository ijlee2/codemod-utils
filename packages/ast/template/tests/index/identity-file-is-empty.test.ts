import { assert, test } from '@codemod-utils/tests';

import { identity } from '../helpers/index.js';

test('index > identity (file is empty)', function () {
  const oldFile = '';

  const newFile = identity(oldFile);

  assert.strictEqual(newFile, '');
});
