import { assert, loadFixture, test } from '@codemod-utils/tests';

import { readPackageJson } from '../../../src/index.js';
import { codemodOptions, options } from '../../shared-test-setups/index.js';

test('json | read-package-json > error handling (package.json is missing)', function () {
  const inputProject = {};

  loadFixture(inputProject, codemodOptions);

  assert.throws(
    () => {
      readPackageJson({
        projectRoot: options.projectRoot,
      });
    },
    (error) => {
      assert.strictEqual(error.message, 'ERROR: package.json is missing.\n');

      return true;
    },
  );
});
