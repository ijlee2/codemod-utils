import { assert, loadFixture, test } from '@codemod-utils/tests';

import { getPackageRoots, normalizeFilePath } from '../../src/index.js';
import { codemodOptions, options } from '../helpers/index.js';

test('get-package-roots > base case', function () {
  const inputProject = {
    'package.json': '',
  };

  loadFixture(inputProject, codemodOptions);

  const packageRoots = getPackageRoots({
    projectRoot: options.projectRoot,
  });

  assert.deepStrictEqual(
    packageRoots,
    ['tmp/test-project'].map(normalizeFilePath),
  );
});
