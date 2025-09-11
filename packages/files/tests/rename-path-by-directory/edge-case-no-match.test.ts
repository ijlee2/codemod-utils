import { assert, test } from '@codemod-utils/tests';

import { renamePathByDirectory } from '../../src/index.js';

test('rename-path-by-directory > edge case (no match)', function () {
  const oldFilePath = 'addon';

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: 'ember-container-query/src',
  });

  assert.strictEqual(newFilePath, 'addon');
});
