import { assert, test } from '@codemod-utils/tests';

import { transformHandlebars } from '../../shared-test-setups/index.js';

test('utils | ast | handlebars > transform (file is empty)', function () {
  const oldFile = '';

  const newFile = transformHandlebars(oldFile);

  assert.strictEqual(newFile, '');
});
