import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { transform } from '../helpers/index.js';

test('index > transform (base case)', function () {
  const oldFile = normalizeFile([
    `{{! Some comment }}`,
    `<div data-test-container local-class="container">`,
    `  {{! Some content }}`,
    `</div>`,
  ]);

  const newFile = transform(oldFile);

  assert.strictEqual(
    newFile,
    normalizeFile([
      `{{! Some comment }}`,
      `<div data-test-container class={{this.styles.container}}>`,
      `  {{! Some content }}`,
      `</div>`,
    ]),
  );
});
