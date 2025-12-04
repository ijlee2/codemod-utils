import { assert, createFile, test } from '@codemod-utils/tests';

import { transformTypeScript } from '../../helpers/index.js';

test('index | typescript > transform (base case)', function () {
  const oldFile = createFile([
    `import Component from '@glimmer/component';`,
    ``,
    `interface NavigationMenuSignature {}`,
    ``,
    `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {}`,
    ``,
  ]);

  const newFile = transformTypeScript(oldFile);

  assert.strictEqual(
    newFile,
    createFile([
      `import Component from '@glimmer/component';`,
      ``,
      `interface NavigationMenuSignature {}`,
      ``,
      `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {`,
      `  styles = styles;`,
      `}`,
      ``,
    ]),
  );
});
