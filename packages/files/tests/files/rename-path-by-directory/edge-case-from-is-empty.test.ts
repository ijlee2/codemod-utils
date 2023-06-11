import { assert, test } from '@codemod-utils/tests';

import { renamePathByDirectory } from '../../../src/index.js';

test('files | rename-path-by-directory > edge case (from is empty)', function () {
  const oldFilePath = 'addon/some-folder/some-file.ts';

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: '',
    to: 'new-location/src',
  });

  assert.strictEqual(
    newFilePath,
    'new-location/src/addon/some-folder/some-file.ts',
  );
});
