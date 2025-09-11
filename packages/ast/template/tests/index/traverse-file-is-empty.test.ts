import { assert, test } from '@codemod-utils/tests';

import { traverseHandlebars } from '../helpers/index.js';

test('index > traverse (file is empty)', function () {
  const oldFile = '';

  const newFile = traverseHandlebars(oldFile);

  assert.strictEqual(newFile, '');
});
