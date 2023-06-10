import { assert, test } from '@codemod-utils/tests';

import { renamePathByDirectory } from '../../../src/index.js';

test('files | rename-path-by-directory > edge case (no match)', function () {
  const oldFilePath = 'addon';

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: 'new-location/src',
  });

  assert.strictEqual(newFilePath, 'addon');
});
