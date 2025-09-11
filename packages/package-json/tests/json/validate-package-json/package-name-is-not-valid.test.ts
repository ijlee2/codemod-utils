import { assert, test } from '@codemod-utils/tests';

import { validatePackageJson } from '../../../src/index.js';

test('json | validate-package-json > package name is not valid', function () {
  const packageJson = {
    name: '@ijlee2/',
    version: '0.0.0',
  };

  assert.throws(
    () => {
      validatePackageJson(packageJson);
    },
    (error: Error) => {
      assert.strictEqual(
        error.message,
        'ERROR: package.json is not valid. (Package name is missing.)\n',
      );

      return true;
    },
  );
});
