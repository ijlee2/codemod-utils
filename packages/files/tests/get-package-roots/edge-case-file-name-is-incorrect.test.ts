import { assert, loadFixture, test } from '@codemod-utils/tests';

import { getPackageRoots } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('get-package-roots > edge case (file name is incorrect)', function () {
  const inputProject = {
    packagejson: '',
    'package.json5': '',
    'somepackage.json': '',
  };

  loadFixture(inputProject, codemodOptions);

  const packageRoots = getPackageRoots({
    projectRoot: options.projectRoot,
  });

  assert.deepStrictEqual(packageRoots, []);
});
