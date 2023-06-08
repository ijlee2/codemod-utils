import { assert, test } from '@codemod-utils/tests';

import { renameDirectory } from '../../../src/index.js';

test('files | rename-directory > edge case (no match)', function () {
  const oldFilePath = 'addon';

  const newFilePath = renameDirectory(oldFilePath, {
    from: 'addon',
    to: 'new-location/src',
  });

  assert.strictEqual(newFilePath, 'addon');
});
