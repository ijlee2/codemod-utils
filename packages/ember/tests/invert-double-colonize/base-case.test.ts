import { assert, test } from '@codemod-utils/tests';

import { invertDoubleColonize } from '../../src/index.js';

test('invert-double-colonize > base case', function () {
  assert.strictEqual(invertDoubleColonize('Hello'), 'hello');

  assert.strictEqual(invertDoubleColonize('HelloWorld'), 'hello-world');

  assert.strictEqual(invertDoubleColonize('HelloWorld123'), 'hello-world123');

  assert.strictEqual(invertDoubleColonize('HelloWorld-123'), 'hello-world-123');

  assert.strictEqual(invertDoubleColonize('ÄpfelUndÖl'), 'äpfel-und-öl');
});
