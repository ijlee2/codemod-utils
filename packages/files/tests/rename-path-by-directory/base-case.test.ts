import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath, renamePathByDirectory } from '../../src/index.js';

test('rename-path-by-directory > base case', function () {
  const oldFilePath = normalizeFilePath('addon/components/container-query.hbs');

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: 'ember-container-query/src',
  });

  assert.strictEqual(
    newFilePath,
    normalizeFilePath(
      'ember-container-query/src/components/container-query.hbs',
    ),
  );
});
