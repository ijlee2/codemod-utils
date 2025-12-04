import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath, parseFilePath } from '../../src/index.js';

test('parse-file-path > edge case (.css.d.ts)', function () {
  const filePath = 'src/components/navigation-menu.css.d.ts';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: 'navigation-menu.css.d.ts',
    dir: normalizeFilePath('src/components'),
    ext: '.css.d.ts',
    name: 'navigation-menu',
  });
});
