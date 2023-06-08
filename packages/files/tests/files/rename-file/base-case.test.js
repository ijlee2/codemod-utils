import { assert, test } from '@codemod-utils/tests';

import { renameFile } from '../../../src/index.js';

test('files | rename-file > base case (1)', function () {
  const oldFilePath = 'app/pods/components/navigation-menu/component.d.ts';

  const newFilePath = renameFile(oldFilePath, {
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

test('files | rename-file > base case (2)', function () {
  const oldFilePath = 'tests/unit/pods/index/controller-test.ts';

  const newFilePath = renameFile(oldFilePath, {
    find: {
      directory: 'tests/unit/pods',
      file: 'controller-test',
    },
    replace: (key) => {
      return `tests/unit/controllers/${key}-test`;
    },
  });

  assert.strictEqual(newFilePath, 'tests/unit/controllers/index-test.ts');
});
