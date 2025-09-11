import { assert, loadFixture, test } from '@codemod-utils/tests';

import { readPackageJson } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('read-package-json > edge case (package version is missing)', function () {
  const inputProject = {
    'package.json': JSON.stringify(
      {
        name: 'workspace-root',
        private: true,
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
    name: 'workspace-root',
    private: true,
  });
});
