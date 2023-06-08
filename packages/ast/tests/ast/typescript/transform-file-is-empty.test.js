import { assert, test } from '@codemod-utils/tests';

import { transformTypeScript } from '../../shared-test-setups/index.js';

test('utils | ast | typescript > transform (file is empty)', function () {
  const oldFile = '';

  const newFile = transformTypeScript(oldFile);

  assert.strictEqual(newFile, '');
});
