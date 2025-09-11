import { assert, test } from '@codemod-utils/tests';

import { pascalize } from '../../../src/index.js';

test('entity-name | pascalize > base case', function () {
  assert.strictEqual(pascalize('hello'), 'Hello');

  assert.strictEqual(pascalize('hello-world'), 'HelloWorld');

  assert.strictEqual(pascalize('hello-world-123'), 'HelloWorld123');
});
