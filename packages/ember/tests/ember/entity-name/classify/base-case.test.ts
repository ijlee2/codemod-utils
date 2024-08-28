import { assert, test } from '@codemod-utils/tests';

import { classify } from '../../../../src/index.js';

test('utils | ember | entity-name | classify > base case', function () {
  assert.strictEqual(classify('hello'), 'Hello');

  assert.strictEqual(classify('hello-world'), 'HelloWorld');

  assert.strictEqual(classify('hello-world-123'), 'HelloWorld123');
});
