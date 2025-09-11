import { assert, loadFixture, test } from '@codemod-utils/tests';

import { getPackageRoots } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('get-package-roots > monorepo', function () {
  const inputProject = {
    'docs-app': {
      'package.json': '',
    },
    packages: {
      'my-folder': {
        'my-package-1': {
          'package.json': '',
        },
      },
      'my-package-2': {
        'package.json': '',
      },
      'my-package-3': {
        'package.json': '',
      },
    },
    'test-app': {
      'package.json': '',
    },
    'package.json': '',
  };

  loadFixture(inputProject, codemodOptions);

  const packageRoots = getPackageRoots({
    projectRoot: options.projectRoot,
  });

  assert.deepStrictEqual(packageRoots, [
    'tmp/test-project/docs-app',
    'tmp/test-project/packages/my-folder/my-package-1',
    'tmp/test-project/packages/my-package-2',
    'tmp/test-project/packages/my-package-3',
    'tmp/test-project/test-app',
  ]);
});
