import { assert, createFile, test } from '@codemod-utils/tests';

import { traverseHandlebars } from '../helpers/index.js';

test('index > traverse (base case)', function () {
  const oldFile = createFile([
    `{{! Some comment }}`,
    `<div data-test-container local-class="container">`,
    `  {{! Some content }}`,
    `</div>`,
  ]);

  const newFile = traverseHandlebars(oldFile);

  assert.strictEqual(
    newFile,
    createFile([
      `{{! Some comment }}`,
      `<div data-test-container local-class="container">`,
      `  {{! Some content }}`,
      `</div>`,
    ]),
  );
});
