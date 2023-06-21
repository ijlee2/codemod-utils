import { assert, test } from '@codemod-utils/tests';

import { parseFilePath } from '../../../src/index.js';

test('files | parse-file-path > edge case (.d.ts)', function () {
  const filePath = 'src/components/navigation-menu.d.ts';

  const parsedPath = parseFilePath(filePath);

  assert.deepEqual(parsedPath, {
    base: 'navigation-menu.d.ts',
    dir: 'src/components',
    ext: '.d.ts',
    name: 'navigation-menu',
  });
});
