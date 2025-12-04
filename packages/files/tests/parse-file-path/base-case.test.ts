import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath, parseFilePath } from '../../src/index.js';

test('parse-file-path > base case', function () {
  const filePath = 'src/components/navigation-menu.hbs';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: 'navigation-menu.hbs',
    dir: normalizeFilePath('src/components'),
    ext: '.hbs',
    name: 'navigation-menu',
  });
});
