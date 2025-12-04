import { assert, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { identity } from '../helpers/index.js';

test('update-javascript > update is identity (1)', function () {
  const oldFile = '';

  const newFile = updateJavaScript(oldFile, identity);

  assert.strictEqual(newFile, oldFile);

  const newFile2 = updateJavaScript(newFile, identity);

  assert.strictEqual(newFile2, newFile);
});
