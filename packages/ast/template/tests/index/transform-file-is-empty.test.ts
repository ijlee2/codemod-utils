import { assert, test } from '@codemod-utils/tests';

import { transformHandlebars } from '../helpers/index.js';

test('index > transform (file is empty)', function () {
  const oldFile = '';

  const newFile = transformHandlebars(oldFile);

  assert.strictEqual(newFile, '');
});
