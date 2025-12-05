import { normalize } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { renamePathByDirectory } from '../../src/index.js';

test('rename-path-by-directory > edge case (to is empty)', function () {
  const oldFilePath = normalize('addon/components/container-query.hbs');

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: '',
  });

  assert.strictEqual(newFilePath, normalize('components/container-query.hbs'));
});
