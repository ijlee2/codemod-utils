import { assert, test } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';

test('find-template-tags > base case', function () {
  const oldFile = '';

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, []);
});
