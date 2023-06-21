import { assert, test } from '@codemod-utils/tests';

import { parseFilePath } from '../../../src/index.js';

test('files | parse-file-path > edge case (special characters)', function () {
  const filePath = 'photos/image (1).png';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: 'image (1).png',
    dir: 'photos',
    ext: '.png',
    name: 'image (1)',
  });
});
