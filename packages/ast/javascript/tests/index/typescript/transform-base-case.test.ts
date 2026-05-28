import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { transform } from '../../helpers/index.js';

test('index | typescript > transform (base case)', function () {
  const oldFile = normalizeFile([
    `import Component from '@glimmer/component';`,
    ``,
    `interface NavigationMenuSignature {}`,
    ``,
    `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {}`,
    ``,
  ]);

  const newFile = transform(oldFile);

  assert.strictEqual(
    newFile,
    normalizeFile([
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
