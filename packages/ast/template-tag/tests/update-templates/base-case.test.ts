import { assert, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { removeClassAttribute } from '../helpers/update-templates.js';

test('update-templates > base case', function () {
  const oldFile = '';

  const newFile = updateTemplates(oldFile, removeClassAttribute);

  assert.strictEqual(newFile, '');

  const newFile2 = updateTemplates(newFile, removeClassAttribute);

  assert.strictEqual(newFile2, newFile);
});
