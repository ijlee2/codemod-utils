import { assert, test } from '@codemod-utils/tests';

import { transformJavaScript } from '../../shared-test-setups/index.js';

test('utils | ast | javascript > transform (base case)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `export default class NavigationMenuComponent extends Component {}`,
    ``,
  ].join('\n');

  const newFile = transformJavaScript(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      ``,
      `export default class NavigationMenuComponent extends Component {`,
      `  styles = styles;`,
      `}`,
      ``,
    ].join('\n'),
  );
});
