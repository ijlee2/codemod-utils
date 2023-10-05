import { assert, test } from '@codemod-utils/tests';

import { renamePathByDirectory } from '../../../src/index.js';

test('files | rename-path-by-directory > edge case (to is empty)', function () {
  const oldFilePath = 'addon/components/container-query.hbs';

  const newFilePath = renamePathByDirectory(oldFilePath, {
    from: 'addon',
    to: '',
  });

  assert.strictEqual(newFilePath, 'components/container-query.hbs');
});
