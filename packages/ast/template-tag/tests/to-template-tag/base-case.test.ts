import { assert, test } from '@codemod-utils/tests';

import { toTemplateTag } from '../../src/index.js';

test('to-template-tag > base case', function () {
  const oldFile = '';

  const newFile = toTemplateTag(oldFile);

  assert.strictEqual(newFile, '');
});
