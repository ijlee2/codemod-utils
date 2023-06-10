import { assert, test } from '@codemod-utils/tests';

import { renamePathByDirectory } from '../../../src/index.js';

test('files | rename-path-by-directory > base case', function () {
  const oldFilePath = 'addon/some-folder/some-file.ts';

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: 'new-location/src',
  });

  assert.strictEqual(newFilePath, 'new-location/src/some-folder/some-file.ts');
});
