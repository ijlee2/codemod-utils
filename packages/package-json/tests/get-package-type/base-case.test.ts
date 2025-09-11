import { assert, test } from '@codemod-utils/tests';

import { getPackageType } from '../../src/index.js';

test('get-package-type > base case', function () {
  const packageJson = {};

  const packageType = getPackageType(packageJson);

  assert.strictEqual(packageType, 'node');
});
