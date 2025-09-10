import { assert, test } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';

test('find-template-tags > class (1)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ].join('\n');

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, []);
});
