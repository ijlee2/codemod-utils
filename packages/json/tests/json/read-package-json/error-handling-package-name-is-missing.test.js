import { assert, loadFixture, test } from '@codemod-utils/tests';

import { readPackageJson } from '../../../src/index.js';
import { codemodOptions, options } from '../../shared-test-setups/index.js';

test('json | read-json > error handling (package name is missing)', function () {
  const inputProject = {
    'package.json': '{}',
  };

  loadFixture(inputProject, codemodOptions);

  assert.throws(
    () => {
      readPackageJson({
        projectRoot: options.projectRoot,
      });
    },
    (error) => {
      assert.strictEqual(
        error.message,
        'ERROR: package.json is missing or is not valid. (Package name is missing.)\n',
      );

      return true;
    },
  );
});
