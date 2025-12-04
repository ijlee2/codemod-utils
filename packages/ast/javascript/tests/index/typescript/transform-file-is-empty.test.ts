import { assert, test } from '@codemod-utils/tests';

import { transformTypeScript } from '../../helpers/index.js';

test('index | typescript > transform (file is empty)', function () {
  const oldFile = '';

  const newFile = transformTypeScript(oldFile);

  assert.strictEqual(newFile, '');
});
