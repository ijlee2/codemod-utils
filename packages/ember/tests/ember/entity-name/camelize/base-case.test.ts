import { assert, test } from '@codemod-utils/tests';

import { camelize } from '../../../../src/index.js';

test('utils | ember | entity-name | camelize > base case', function () {
  assert.strictEqual(camelize('innerHTML'), 'innerHTML');
  assert.strictEqual(camelize('action_name'), 'actionName');
  assert.strictEqual(camelize('css-class-name'), 'cssClassName');
});
