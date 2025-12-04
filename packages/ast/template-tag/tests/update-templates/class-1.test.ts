import { assert, createFile, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { removeClassAttribute } from '../helpers/update-templates.js';

test('update-templates > class (1)', function () {
  const oldFile = createFile([
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ]);

  const newFile = updateTemplates(oldFile, removeClassAttribute);

  assert.strictEqual(
    newFile,
    createFile([
      `import Component from '@glimmer/component';`,
      ``,
      `export default class MyComponent extends Component {}`,
      ``,
    ]),
  );

  const newFile2 = updateTemplates(newFile, removeClassAttribute);

  assert.strictEqual(newFile2, newFile);
});
