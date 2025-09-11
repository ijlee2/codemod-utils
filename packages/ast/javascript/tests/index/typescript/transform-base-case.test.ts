import { assert, test } from '@codemod-utils/tests';

import { transformTypeScript } from '../../helpers/typescript.js';

test('index | typescript > transform (base case)', function () {
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
