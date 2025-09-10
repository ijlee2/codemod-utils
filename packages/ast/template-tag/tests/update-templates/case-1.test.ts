import { assert, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { removeClassAttribute } from '../helpers/update-templates.js';

test('update-templates > class (1)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ].join('\n');

  const newFile = updateTemplates(oldFile, removeClassAttribute);

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      ``,
      `export default class MyComponent extends Component {}`,
      ``,
    ].join('\n'),
  );
});
