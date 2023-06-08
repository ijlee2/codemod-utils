import { assert, test } from '@codemod-utils/tests';

import { traverseHandlebars } from '../../shared-test-setups/index.js';

test('utils | ast | handlebars > traverse (file is empty)', function () {
  const oldFile = '';

  const newFile = traverseHandlebars(oldFile);

  assert.strictEqual(newFile, '');
});
