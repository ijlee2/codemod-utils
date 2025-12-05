import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { traverseJavaScript } from '../../helpers/index.js';

test('index | javascript > traverse (base case)', function () {
  const oldFile = normalizeFile([
    `import Component from '@glimmer/component';`,
    ``,
    `export default class NavigationMenuComponent extends Component {}`,
    ``,
  ]);

  const newFile = traverseJavaScript(oldFile);

  assert.strictEqual(
    newFile,
    normalizeFile([
      `import Component from '@glimmer/component';`,
      ``,
      `export default class NavigationMenuComponent extends Component {}`,
      ``,
    ]),
  );
});
