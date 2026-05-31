import { assert, test } from '@codemod-utils/tests';

import { parseVersion } from '../../src/index.js';

test('parse-version > version is undefined', function () {
  assert.strictEqual(parseVersion(undefined), undefined);
});
