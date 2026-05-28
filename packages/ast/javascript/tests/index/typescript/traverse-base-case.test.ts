import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { traverse } from '../../helpers/index.js';

test('index | typescript > traverse (base case)', function () {
  const oldFile = normalizeFile([
    `import Component from '@glimmer/component';`,
    ``,
    `interface NavigationMenuSignature {}`,
    ``,
    `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {}`,
    ``,
  ]);

  const newFile = traverse(oldFile);

  assert.strictEqual(
    newFile,
    normalizeFile([
      `import Component from '@glimmer/component';`,
      ``,
      `interface NavigationMenuSignature {}`,
      ``,
      `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {}`,
      ``,
    ]),
  );
});
