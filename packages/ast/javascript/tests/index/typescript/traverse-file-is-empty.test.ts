import { assert, test } from '@codemod-utils/tests';

import { traverseTypeScript } from '../../helpers/typescript.js';

test('index | typescript > traverse (file is empty)', function () {
  const oldFile = '';

  const newFile = traverseTypeScript(oldFile);

  assert.strictEqual(newFile, '');
});
