import { assert, createFile, test } from '@codemod-utils/tests';

import { traverseJavaScript } from '../../helpers/index.js';

test('index | javascript > traverse (base case)', function () {
  const oldFile = createFile([
    `import Component from '@glimmer/component';`,
    ``,
    `export default class NavigationMenuComponent extends Component {}`,
    ``,
  ]);

  const newFile = traverseJavaScript(oldFile);

  assert.strictEqual(
    newFile,
    createFile([
      `import Component from '@glimmer/component';`,
      ``,
      `export default class NavigationMenuComponent extends Component {}`,
      ``,
    ]),
  );
});
