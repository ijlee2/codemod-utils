import { assert, test } from '@codemod-utils/tests';

import { traverseTypeScript } from '../../shared-test-setups/index.js';

test('utils | ast | typescript > traverse (base case)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `interface NavigationMenuSignature {}`,
    ``,
    `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {}`,
    ``,
  ].join('\n');
  const newFile = traverseTypeScript(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      ``,
      `interface NavigationMenuSignature {}`,
      ``,
      `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {}`,
      ``,
    ].join('\n'),
  );
});
