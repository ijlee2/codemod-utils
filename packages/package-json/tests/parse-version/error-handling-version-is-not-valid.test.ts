import { assert, test } from '@codemod-utils/tests';

import { parseVersion } from '../../src/index.js';

test('parse-version > error handling (version is not valid)', function () {
  assert.strictEqual(parseVersion('x.y.z'), undefined);

  assert.strictEqual(parseVersion('x.2.3'), undefined);

  assert.strictEqual(parseVersion('$1.2.3'), undefined);

  assert.strictEqual(parseVersion('^^1.2.3'), undefined);

  assert.strictEqual(parseVersion('^~1.2.3'), undefined);

  assert.strictEqual(parseVersion('~^1.2.3'), undefined);

  assert.strictEqual(parseVersion('~~1.2.3'), undefined);
});
