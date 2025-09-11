import { assert, test } from '@codemod-utils/tests';

import { getFilePath } from '../../src/index.js';

test('get-file-path > base case', function () {
  const fileURL = import.meta.url;
  const filePath = getFilePath(fileURL);

  assert.strictEqual(filePath.endsWith('tests/get-file-path'), true);
});
