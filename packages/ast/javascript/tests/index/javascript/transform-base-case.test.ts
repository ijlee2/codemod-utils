import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { transform } from '../../helpers/index.js';

test('index | javascript > transform (base case)', function () {
  const oldFile = normalizeFile([
    `import Component from '@glimmer/component';`,
    ``,
    `export default class NavigationMenuComponent extends Component {}`,
    ``,
  ]);

  const newFile = transform(oldFile);

  assert.strictEqual(
    newFile,
    normalizeFile([
      `import Component from '@glimmer/component';`,
      ``,
      `export default class NavigationMenuComponent extends Component {`,
      `  styles = styles;`,
      `}`,
      ``,
    ]),
  );
});
