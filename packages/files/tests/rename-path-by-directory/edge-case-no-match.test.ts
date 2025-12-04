import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath, renamePathByDirectory } from '../../src/index.js';

test('rename-path-by-directory > edge case (no match)', function () {
  const oldFilePath = normalizeFilePath('addon');

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: 'ember-container-query/src',
  });

  assert.strictEqual(newFilePath, normalizeFilePath('addon'));
});
