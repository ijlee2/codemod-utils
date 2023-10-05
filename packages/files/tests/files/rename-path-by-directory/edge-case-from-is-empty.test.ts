import { assert, test } from '@codemod-utils/tests';

import { renamePathByDirectory } from '../../../src/index.js';

test('files | rename-path-by-directory > edge case (from is empty)', function () {
  const oldFilePath = 'addon/components/container-query.hbs';

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: '',
    to: 'ember-container-query/src',
  });

  assert.strictEqual(
    newFilePath,
    'ember-container-query/src/addon/components/container-query.hbs',
  );
});
