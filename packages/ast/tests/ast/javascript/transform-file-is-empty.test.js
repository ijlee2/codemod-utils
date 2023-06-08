import { assert, test } from '@codemod-utils/tests';

import { transformJavaScript } from '../../shared-test-setups/index.js';

test('utils | ast | javascript > transform (file is empty)', function () {
  const oldFile = '';

  const newFile = transformJavaScript(oldFile);

  assert.strictEqual(newFile, '');
});
