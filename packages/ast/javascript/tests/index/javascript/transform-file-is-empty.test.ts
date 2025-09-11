import { assert, test } from '@codemod-utils/tests';

import { transformJavaScript } from '../../helpers/javascript.js';

test('index | javascript > transform (file is empty)', function () {
  const oldFile = '';

  const newFile = transformJavaScript(oldFile);

  assert.strictEqual(newFile, '');
});
