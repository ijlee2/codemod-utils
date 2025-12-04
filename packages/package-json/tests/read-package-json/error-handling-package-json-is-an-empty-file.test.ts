import { assert, loadFixture, test } from '@codemod-utils/tests';

import { readPackageJson } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('read-package-json > error handling (package.json is an empty file)', function () {
  const inputProject = {
    'package.json': '',
  };

  loadFixture(inputProject, codemodOptions);

  assert.throws(
    () => {
      readPackageJson({
        projectRoot: options.projectRoot,
      });
    },
    (error: Error) => {
      assert.strictEqual(
        error.message,
        'ERROR: package.json is not valid. (Unexpected end of JSON input)',
      );

      return true;
    },
  );
});
