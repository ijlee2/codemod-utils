import { assert, test } from '@codemod-utils/tests';

import { traverseHandlebars } from '../../shared-test-setups/index.js';

test('utils | ast | handlebars > traverse (base case)', function () {
  const oldFile = [
    `{{! Some comment }}`,
    `<div data-test-container local-class="container">`,
    `  {{! Some content }}`,
    `</div>`,
    ``,
  ].join('\n');

  const newFile = traverseHandlebars(oldFile);

  assert.strictEqual(
    newFile,
    [
      `{{! Some comment }}`,
      `<div data-test-container local-class="container">`,
      `  {{! Some content }}`,
      `</div>`,
      ``,
    ].join('\n'),
  );
});
