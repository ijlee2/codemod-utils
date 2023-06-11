import { assert, test } from '@codemod-utils/tests';

import { renamePathByDirectory } from '../../../src/index.js';

test('files | rename-path-by-directory > edge case (to is empty)', function () {
  const oldFilePath = 'addon/some-folder/some-file.ts';

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: '',
  });

  assert.strictEqual(newFilePath, 'some-folder/some-file.ts');
});
