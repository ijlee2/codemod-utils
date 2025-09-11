import { assert, test } from '@codemod-utils/tests';

import { validatePackageJson } from '../../src/index.js';

test('validate-package-json > package version is missing', function () {
  const packageJson = {
    name: 'workspace-root',
    private: true,
  };

  assert.throws(
    () => {
      validatePackageJson(packageJson);
    },
    (error: Error) => {
      assert.strictEqual(
        error.message,
        'ERROR: package.json is not valid. (Package version is missing.)\n',
      );

      return true;
    },
  );
});
