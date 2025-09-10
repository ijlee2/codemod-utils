import { assert, test } from '@codemod-utils/tests';

import { preprocess } from '../../src/index.js';

test('preprocess > class (1)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ].join('\n');

  const { javascript, templateTags } = preprocess(oldFile);

  assert.strictEqual(
    javascript,
    [
      `import Component from '@glimmer/component';`,
      `export default class MyComponent extends Component {`,
      `}`,
      ``,
    ].join('\n'),
  );

  assert.deepStrictEqual(templateTags, []);
});
