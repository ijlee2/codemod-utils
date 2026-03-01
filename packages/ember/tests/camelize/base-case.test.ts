import { assert, test } from '@codemod-utils/tests';

import { camelize } from '../../src/index.js';

test('entity-name | camelize > base case', function () {
  assert.strictEqual(camelize('hello'), 'hello');

  assert.strictEqual(camelize('hello-world'), 'helloWorld');

  assert.strictEqual(camelize('hello-world123'), 'helloWorld123');

  assert.strictEqual(camelize('hello-world-123'), 'helloWorld123');
});
