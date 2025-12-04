import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath } from '../../src/index.js';

test('parse-file-path > base case', function () {
  const filePath = normalizeFilePath('src');

  assert.strictEqual(filePath, 'src');
});
