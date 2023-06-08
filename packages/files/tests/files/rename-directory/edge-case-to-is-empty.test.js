import { assert, test } from '@codemod-utils/tests';

import { renameDirectory } from '../../../src/index.js';

test('files | rename-directory > edge case (to is empty)', function () {
  const oldFilePath = 'addon/some-folder/some-file.ts';

  const newFilePath = renameDirectory(oldFilePath, {
    from: 'addon',
    to: '',
  });

  assert.strictEqual(newFilePath, 'some-folder/some-file.ts');
});
