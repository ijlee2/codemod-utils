import { assert, test } from '@codemod-utils/tests';

import { traverseHandlebars } from '../helpers/index.js';

test('index > traverse (base case)', function () {
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
