import { assert, test } from '@codemod-utils/tests';

import { renameDirectory } from '../../../src/index.js';

test('files | rename-directory > base case', function () {
  const oldFilePath = 'addon/some-folder/some-file.ts';

  const newFilePath = renameDirectory(oldFilePath, {
    from: 'addon',
    to: 'new-location/src',
  });

  assert.strictEqual(newFilePath, 'new-location/src/some-folder/some-file.ts');
});
