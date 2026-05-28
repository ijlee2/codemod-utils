import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { identity } from '../../helpers/index.js';

test('index | typescript > identity (base case)', function () {
  const oldFile = normalizeFile([
    `import Component from '@glimmer/component';`,
    ``,
    `interface NavigationMenuSignature {}`,
    ``,
    `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {}`,
    ``,
  ]);

  const newFile = identity(oldFile);

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
