import { assert, test } from '@codemod-utils/tests';

import { renamePathByFile } from '../../../src/index.js';

test('files | rename-path-by-file > base case', function () {
  const oldFilePath = 'app/pods/components/navigation-menu/component.d.ts';

  const newFilePath = renamePathByFile(oldFilePath, {
    find: {
      directory: 'app/pods/components',
      file: 'component',
    },
    replace: (key) => {
      return `app/components/${key}`;
    },
  });

  assert.strictEqual(newFilePath, 'app/components/navigation-menu.d.ts');
});
