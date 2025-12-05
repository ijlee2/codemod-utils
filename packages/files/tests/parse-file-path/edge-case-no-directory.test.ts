import { assert, test } from '@codemod-utils/tests';

import { parseFilePath } from '../../src/index.js';

test('parse-file-path > edge case (no directory)', function () {
  const filePath = 'README.md';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: 'README.md',
    dir: '',
    ext: '.md',
    name: 'README',
  });
});
