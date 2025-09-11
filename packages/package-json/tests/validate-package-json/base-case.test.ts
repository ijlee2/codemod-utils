import { assert, test } from '@codemod-utils/tests';

import { validatePackageJson } from '../../src/index.js';

test('validate-package-json > base case', function () {
  const packageJson = {
    name: 'ember-container-query',
    version: '3.2.0',
  };

  validatePackageJson(packageJson);

  assert.ok(true);
});
