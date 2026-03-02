import { sep } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { getFilePath } from '../../src/index.js';

test('get-file-path > base case', function () {
  const filePath = getFilePath(import.meta.url);

  assert.strictEqual(filePath.endsWith(`tests${sep}get-file-path`), true);
});
