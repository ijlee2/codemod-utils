import { assert, test } from '@codemod-utils/tests';

import { traverse } from '../../helpers/index.js';

test('index | javascript > traverse (file is empty)', function () {
  const oldFile = '';

  const newFile = traverse(oldFile);

  assert.strictEqual(newFile, '');
});
