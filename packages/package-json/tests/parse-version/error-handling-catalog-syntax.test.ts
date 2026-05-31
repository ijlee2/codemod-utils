import { assert, test } from '@codemod-utils/tests';

import { parseVersion } from '../../src/index.js';

test('parse-version > error handling (catalog syntax)', function () {
  assert.strictEqual(parseVersion('catalog:'), undefined);
});
