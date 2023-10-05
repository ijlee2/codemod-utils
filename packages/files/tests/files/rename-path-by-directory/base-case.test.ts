import { assert, test } from '@codemod-utils/tests';

import { renamePathByDirectory } from '../../../src/index.js';

test('files | rename-path-by-directory > base case', function () {
  const oldFilePath = 'addon/components/container-query.hbs';

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: 'ember-container-query/src',
  });

  assert.strictEqual(
    newFilePath,
    'ember-container-query/src/components/container-query.hbs',
  );
});
