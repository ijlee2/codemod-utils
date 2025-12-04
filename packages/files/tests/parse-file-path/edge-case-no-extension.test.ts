import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath, parseFilePath } from '../../src/index.js';

test('parse-file-path > edge case (no extension)', function () {
  const filePath = '.gitignore';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: '.gitignore',
    dir: normalizeFilePath(''),
    ext: '',
    name: '.gitignore',
  });
});
