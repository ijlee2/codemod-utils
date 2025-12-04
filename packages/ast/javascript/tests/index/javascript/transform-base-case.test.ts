import { assert, createFile, test } from '@codemod-utils/tests';

import { transformJavaScript } from '../../helpers/index.js';

test('index | javascript > transform (base case)', function () {
  const oldFile = createFile([
    `import Component from '@glimmer/component';`,
    ``,
    `export default class NavigationMenuComponent extends Component {}`,
    ``,
  ]);

  const newFile = transformJavaScript(oldFile);

  assert.strictEqual(
    newFile,
    createFile([
      `import Component from '@glimmer/component';`,
      ``,
      `export default class NavigationMenuComponent extends Component {`,
      `  styles = styles;`,
      `}`,
      ``,
    ]),
  );
});
