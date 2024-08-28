import { assert, test } from '@codemod-utils/tests';

import { camelize } from '../../../../src/index.js';

test('utils | ember | entity-name | camelize > base case', function () {
  assert.strictEqual(camelize('hello'), 'hello');

  assert.strictEqual(camelize('hello-world'), 'helloWorld');

  assert.strictEqual(camelize('hello-world-123'), 'helloWorld123');
});
