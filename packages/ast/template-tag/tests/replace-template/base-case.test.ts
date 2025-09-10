import { assert, test } from '@codemod-utils/tests';

import { replaceTemplate } from '../../src/index.js';

test('replace-template > base case', function () {
  const oldFile = '';

  const newFile = replaceTemplate(oldFile, {
    range: {
      endByte: 0,
      endChar: 0,
      startByte: 0,
      startChar: 0,
    },
    template: 'New contents',
  });

  assert.strictEqual(newFile, '<template>New contents</template>');
});
