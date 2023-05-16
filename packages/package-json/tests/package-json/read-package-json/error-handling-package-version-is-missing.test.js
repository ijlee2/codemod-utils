import { assert, loadFixture, test } from '@codemod-utils/tests';

import { readPackageJson } from '../../../src/index.js';
import { codemodOptions } from '../../shared-test-setups/index.js';

test('package-json | read-package-json > error handling (package version is missing)', function () {
  const inputProject = {
    'package.json': JSON.stringify(
      {
        name: 'ember-container-query',
      },
      null,
      2,
    ),
  };

  loadFixture(inputProject, codemodOptions);

  assert.throws(
    () => {
      readPackageJson(codemodOptions);
    },
    (error) => {
      assert.strictEqual(
        error.message,
        'ERROR: package.json is missing or is not valid. (Package version is missing.)\n',
      );

      return true;
    },
  );
});
