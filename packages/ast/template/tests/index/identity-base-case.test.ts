import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { identity } from '../helpers/index.js';

test('index > identity (base case)', function () {
  const oldFile = normalizeFile([
    `{{! Some comment }}`,
    `<div data-test-container local-class="container">`,
    `  {{! Some content }}`,
    `</div>`,
  ]);

  const newFile = identity(oldFile);

  assert.strictEqual(
    newFile,
    normalizeFile([
      `{{! Some comment }}`,
      `<div data-test-container local-class="container">`,
      `  {{! Some content }}`,
      `</div>`,
    ]),
  );
});
