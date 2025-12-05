import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';

test('find-template-tags > edge case (hbs)', function () {
  const oldFile = normalizeFile([
    `<div class={{this.styles.container}}>`,
    `  Hello world!`,
    `</div>`,
  ]);

  assert.throws(
    () => {
      findTemplateTags(oldFile);
    },
    (error: Error) => {
      return error.message === 'Parse Error at <anon>:1:6: 1:11';
    },
  );
});
