import { assert, loadFixture, test } from '@codemod-utils/tests';

import { readPackageJson } from '../../../src/index.js';
import { codemodOptions, options } from '../../shared-test-setups/index.js';

test('json | read-package-json > error handling (package.json is not a valid JSON)', function () {
  const inputProject = {
    'package.json': '{\n  "name": }',
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
        'ERROR: package.json is not valid. (Unexpected token } in JSON at position 12)\n',
      );

      return true;
    },
  );
});
