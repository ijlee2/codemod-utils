import { normalize } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { renamePathByDirectory } from '../../src/index.js';

test('rename-path-by-directory > edge case (no match)', function () {
  const oldFilePath = normalize('addon');

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: 'ember-container-query/src',
  });

  assert.strictEqual(newFilePath, normalize('addon'));
});
