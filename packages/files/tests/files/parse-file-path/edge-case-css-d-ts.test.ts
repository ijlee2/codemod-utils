import { assert, test } from '@codemod-utils/tests';

import { parseFilePath } from '../../../src/index.js';

test('files | parse-file-path > edge case (.css.d.ts)', function () {
  const filePath = 'src/components/navigation-menu.css.d.ts';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: 'navigation-menu.css.d.ts',
    dir: 'src/components',
    ext: '.css.d.ts',
    name: 'navigation-menu',
  });
});
