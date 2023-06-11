import { assert, test } from '@codemod-utils/tests';

import { renamePathByFile } from '../../../src/index.js';

test('files | rename-path-by-file > edge case (replace appends suffix)', function () {
  const oldFilePath = 'tests/unit/pods/index/controller-test.ts';

  const newFilePath = renamePathByFile(oldFilePath, {
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
