import { assert, createFile, test } from '@codemod-utils/tests';

import { toTemplateTag } from '../../src/index.js';

test('to-template-tag > class (1)', function () {
  const oldFile = createFile([
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ]);

  const newFile = toTemplateTag(oldFile);

  assert.strictEqual(
    newFile,
    createFile([
      `import Component from '@glimmer/component';`,
      ``,
      `export default class MyComponent extends Component {}`,
      ``,
    ]),
  );

  const newFile2 = toTemplateTag(newFile);

  assert.strictEqual(newFile2, newFile);
});
