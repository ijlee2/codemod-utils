import { assert, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { identity } from '../helpers/index.js';

test('update-templates > update is identity (1)', function () {
  const oldFile = '';

  const newFile = updateTemplates(oldFile, identity);

  assert.strictEqual(newFile, oldFile);

  const newFile2 = updateTemplates(newFile, identity);

  assert.strictEqual(newFile2, newFile);
});
