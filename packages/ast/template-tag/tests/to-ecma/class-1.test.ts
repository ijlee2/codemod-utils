import { assert, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > class (1)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ].join('\n');

  const newFile = toEcma(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      `export default class MyComponent extends Component {`,
      `}`,
      ``,
    ].join('\n'),
  );
});
