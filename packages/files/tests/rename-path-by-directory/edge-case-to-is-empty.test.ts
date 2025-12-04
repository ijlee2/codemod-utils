import { assert, test } from '@codemod-utils/tests';

import { normalizeFilePath, renamePathByDirectory } from '../../src/index.js';

test('rename-path-by-directory > edge case (to is empty)', function () {
  const oldFilePath = normalizeFilePath('addon/components/container-query.hbs');

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: '',
  });

  assert.strictEqual(
    newFilePath,
    normalizeFilePath('components/container-query.hbs'),
  );
});
