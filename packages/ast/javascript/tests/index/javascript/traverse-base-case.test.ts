import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { traverse } from '../../helpers/index.js';

test('index | javascript > traverse (base case)', function () {
  const oldFile = normalizeFile([
    `import Component from '@glimmer/component';`,
    ``,
    `export default class NavigationMenuComponent extends Component {}`,
    ``,
  ]);

  const newFile = traverse(oldFile);

  assert.strictEqual(
    newFile,
    normalizeFile([
      `import Component from '@glimmer/component';`,
      ``,
      `export default class NavigationMenuComponent extends Component {}`,
      ``,
    ]),
  );
});
