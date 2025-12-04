import { assert, createFile, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > class (1)', function () {
  const oldFile = createFile([
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ]);

  const newFile = toEcma(oldFile);

  assert.strictEqual(
    newFile,
    createFile([
      `import Component from '@glimmer/component';`,
      ``,
      `export default class MyComponent extends Component {}`,
      ``,
    ]),
  );

  const newFile2 = toEcma(newFile);

  assert.strictEqual(newFile2, newFile);
});
