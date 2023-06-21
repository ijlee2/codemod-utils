import { assert, test } from '@codemod-utils/tests';

import { parseFilePath } from '../../../src/index.js';

test('files | parse-file-path > base case', function () {
  const filePath = 'src/components/navigation-menu.hbs';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: 'navigation-menu.hbs',
    dir: 'src/components',
    ext: '.hbs',
    name: 'navigation-menu',
  });
});
