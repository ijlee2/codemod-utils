import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath, parseFilePath } from '../../src/index.js';

test('parse-file-path > edge case (.d.ts)', function () {
  const filePath = 'src/components/navigation-menu.d.ts';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: 'navigation-menu.d.ts',
    dir: normalizeFilePath('src/components'),
    ext: '.d.ts',
    name: 'navigation-menu',
  });
});
