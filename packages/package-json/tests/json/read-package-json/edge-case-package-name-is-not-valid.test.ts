import { assert, loadFixture, test } from '@codemod-utils/tests';

import { readPackageJson } from '../../../src/index.js';
import { codemodOptions, options } from '../../shared-test-setups/index.js';

test('json | read-package-json > edge case (package name is not valid)', function () {
  const inputProject = {
    'package.json': JSON.stringify(
      {
        name: '@ijlee2/',
        version: '0.0.0',
      },
      null,
      2,
    ),
  };

  loadFixture(inputProject, codemodOptions);

  const packageJson = readPackageJson({
    projectRoot: options.projectRoot,
  });

  assert.deepStrictEqual(packageJson, {
    name: '@ijlee2/',
    version: '0.0.0',
  });
});
