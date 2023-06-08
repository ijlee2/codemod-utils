import { assert, test } from '@codemod-utils/tests';

import { traverseTypeScript } from '../../shared-test-setups/index.js';

test('utils | ast | typescript > traverse (file is empty)', function () {
  const oldFile = '';

  const newFile = traverseTypeScript(oldFile);

  assert.strictEqual(newFile, '');
});
