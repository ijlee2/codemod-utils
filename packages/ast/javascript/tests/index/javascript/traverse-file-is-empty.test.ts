import { assert, test } from '@codemod-utils/tests';

import { traverseJavaScript } from '../../helpers/index.js';

test('index | javascript > traverse (file is empty)', function () {
  const oldFile = '';

  const newFile = traverseJavaScript(oldFile);

  assert.strictEqual(newFile, '');
});
