import { assert, test } from '@codemod-utils/tests';

import { getFilePath } from '../../../src/index.js';

test('blueprints | get-file-path > base case', function () {
  const fileURL = import.meta.url;
  const filePath = getFilePath(fileURL);

  assert.strictEqual(filePath.endsWith('tests/blueprints/get-file-path'), true);
});
