import { assert, test } from '@codemod-utils/tests';

import { traverse } from '../../helpers/index.js';

test('index | typescript > traverse (file is empty)', function () {
  const oldFile = '';

  const newFile = traverse(oldFile);

  assert.strictEqual(newFile, '');
});
