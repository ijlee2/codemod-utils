import { assert, createFile, test } from '@codemod-utils/tests';

import { traverseTypeScript } from '../../helpers/index.js';

test('index | typescript > traverse (base case)', function () {
  const oldFile = createFile([
    `import Component from '@glimmer/component';`,
    ``,
    `interface NavigationMenuSignature {}`,
    ``,
    `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {}`,
    ``,
  ]);

  const newFile = traverseTypeScript(oldFile);

  assert.strictEqual(
    newFile,
    createFile([
      `import Component from '@glimmer/component';`,
      ``,
      `interface NavigationMenuSignature {}`,
      ``,
      `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {}`,
      ``,
    ]),
  );
});
