import { assert, test } from '@codemod-utils/tests';

import { transformHandlebars } from '../helpers/index.js';

test('index > transform (base case)', function () {
  const oldFile = [
    `{{! Some comment }}`,
    `<div data-test-container local-class="container">`,
    `  {{! Some content }}`,
    `</div>`,
    ``,
  ].join('\n');

  const newFile = transformHandlebars(oldFile);

  assert.strictEqual(
    newFile,
    [
      `{{! Some comment }}`,
      `<div data-test-container class={{this.styles.container}}>`,
      `  {{! Some content }}`,
      `</div>`,
      ``,
    ].join('\n'),
  );
});
