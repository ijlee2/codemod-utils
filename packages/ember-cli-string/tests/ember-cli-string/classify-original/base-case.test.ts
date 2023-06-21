import { assert, test } from '@codemod-utils/tests';

import { classifyOriginal } from '../../../src/index.js';

test('utils | ember-cli-string | classify-original > base case', function () {
  assert.strictEqual(classifyOriginal('innerHTML'), 'InnerHTML');
  assert.strictEqual(classifyOriginal('action_name'), 'ActionName');
  assert.strictEqual(classifyOriginal('css-class-name'), 'CssClassName');
});
