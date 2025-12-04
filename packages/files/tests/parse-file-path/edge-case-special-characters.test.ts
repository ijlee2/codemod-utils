import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath, parseFilePath } from '../../src/index.js';

test('parse-file-path > edge case (special characters)', function () {
  const filePath = 'photos/image (1).png';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: 'image (1).png',
    dir: normalizeFilePath('photos'),
    ext: '.png',
    name: 'image (1)',
  });
});
