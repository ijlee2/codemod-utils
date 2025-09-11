import { assert, test } from '@codemod-utils/tests';

import { traverseJavaScript } from '../../helpers/javascript.js';

test('index | javascript > traverse (base case)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `export default class NavigationMenuComponent extends Component {}`,
    ``,
  ].join('\n');

  const newFile = traverseJavaScript(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      ``,
      `export default class NavigationMenuComponent extends Component {}`,
      ``,
    ].join('\n'),
  );
});
