import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath, renamePathByDirectory } from '../../src/index.js';

test('rename-path-by-directory > edge case (from is empty)', function () {
  const oldFilePath = normalizeFilePath('addon/components/container-query.hbs');

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: '',
    to: 'ember-container-query/src',
  });

  assert.strictEqual(
    newFilePath,
    normalizeFilePath(
      'ember-container-query/src/addon/components/container-query.hbs',
    ),
  );
});
