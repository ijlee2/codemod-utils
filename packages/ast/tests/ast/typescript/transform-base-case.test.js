import { assert, test } from '@codemod-utils/tests';

import { transformTypeScript } from '../../shared-test-setups/index.js';

test('utils | ast | typescript > transform (base case)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `interface NavigationMenuSignature {}`,
    ``,
    `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {}`,
    ``,
  ].join('\n');

  const newFile = transformTypeScript(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      ``,
      `interface NavigationMenuSignature {}`,
      ``,
      `export default class NavigationMenuComponent extends Component<NavigationMenuSignature> {`,
      `  styles = styles;`,
      `}`,
      ``,
    ].join('\n'),
  );
});
