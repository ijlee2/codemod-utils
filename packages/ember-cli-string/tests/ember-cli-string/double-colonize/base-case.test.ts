import { assert, test } from '@codemod-utils/tests';

import { doubleColonize } from '../../../src/index.js';

test('utils | ember-cli-string | double-colonize > base case', function () {
  assert.strictEqual(doubleColonize('innerHTML'), 'InnerHTML');
  assert.strictEqual(doubleColonize('action_name'), 'ActionName');
  assert.strictEqual(doubleColonize('css-class-name'), 'CssClassName');
});
