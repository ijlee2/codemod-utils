import { assert, test } from '@codemod-utils/tests';

import { traverseTypeScript } from '../../helpers/index.js';

test('index | typescript > traverse (file is empty)', function () {
  const oldFile = '';

  const newFile = traverseTypeScript(oldFile);

  assert.strictEqual(newFile, '');
});
