import { assert, test } from '@codemod-utils/tests';

import { traverseJavaScript } from '../../shared-test-setups/index.js';

test('utils | ast | javascript > traverse (file is empty)', function () {
  const oldFile = '';

  const newFile = traverseJavaScript(oldFile);

  assert.strictEqual(newFile, '');
});
