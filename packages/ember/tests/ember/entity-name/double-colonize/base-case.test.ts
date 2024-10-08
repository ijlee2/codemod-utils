import { assert, test } from '@codemod-utils/tests';

import { doubleColonize } from '../../../../src/index.js';

test('utils | ember | entity-name | double-colonize > base case', function () {
  assert.strictEqual(doubleColonize('hello'), 'Hello');

  assert.strictEqual(doubleColonize('hello-world'), 'HelloWorld');

  assert.strictEqual(doubleColonize('hello-world-123'), 'HelloWorld123');
});
