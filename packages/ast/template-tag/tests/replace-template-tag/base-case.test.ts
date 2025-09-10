import { assert, test } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';

test('replace-template-tag > base case', function () {
  const oldFile = '';

  const newFile = replaceTemplateTag(oldFile, {
    code: '<template>New contents</template>',
    range: {
      endByte: 0,
      endChar: 0,
      startByte: 0,
      startChar: 0,
    },
  });

  assert.strictEqual(newFile, '<template>New contents</template>');
});
