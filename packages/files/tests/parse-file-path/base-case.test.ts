import { normalize } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { parseFilePath } from '../../src/index.js';

test('parse-file-path > base case', function () {
  const filePath = 'src/components/navigation-menu.hbs';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: 'navigation-menu.hbs',
    dir: normalize('src/components'),
    ext: '.hbs',
    name: 'navigation-menu',
  });
});
