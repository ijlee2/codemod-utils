import { assert, test } from '@codemod-utils/tests';

import { transform } from '../../helpers/index.js';

test('index | javascript > transform (file is empty)', function () {
  const oldFile = '';

  const newFile = transform(oldFile);

  assert.strictEqual(newFile, '');
});
