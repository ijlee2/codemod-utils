import { assert, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { data, renameGetters } from '../helpers/update-javascript.js';

test('update-javascript > class (1)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ].join('\n');

  const newFile = updateJavaScript(oldFile, (code) => {
    return renameGetters(code, data);
  });

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
