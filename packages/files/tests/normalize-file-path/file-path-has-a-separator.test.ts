import { sep } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath } from '../../src/index.js';

const onWindows = sep === '\\';

test('parse-file-path > file path has a separator', function () {
  const filePath = normalizeFilePath('src/components/navigation-menu.hbs');

  if (onWindows) {
    assert.strictEqual(filePath, 'src\\components\\navigation-menu.hbs');
    return;
  }

  assert.strictEqual(filePath, 'src/components/navigation-menu.hbs');
});
