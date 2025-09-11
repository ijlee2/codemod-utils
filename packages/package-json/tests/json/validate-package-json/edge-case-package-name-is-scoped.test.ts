import { assert, test } from '@codemod-utils/tests';

import { validatePackageJson } from '../../../src/index.js';

test('json | validate-package-json > edge case (package name is scoped)', function () {
  const packageJson = {
    name: '@ijlee2/ember-container-query',
    version: '3.2.0',
  };

  validatePackageJson(packageJson);

  assert.ok(true);
});
