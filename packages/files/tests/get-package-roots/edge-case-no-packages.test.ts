import { assert, loadFixture, test } from '@codemod-utils/tests';

import { getPackageRoots } from '../../src/index.js';
import { codemodOptions, options } from '../helpers/index.js';

test('get-package-roots > edge case (no packages)', function () {
  const inputProject = {};

  loadFixture(inputProject, codemodOptions);

  const packageRoots = getPackageRoots({
    projectRoot: options.projectRoot,
  });

  assert.deepStrictEqual(packageRoots, []);
});
