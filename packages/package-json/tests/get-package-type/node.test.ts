import { assert, test } from '@codemod-utils/tests';

import { getPackageType } from '../../src/index.js';

test('get-package-type > node', function () {
  const packageJson = {
    name: '@ijlee2-frontend-configs/prettier',
    version: '2.1.1',
    dependencies: {
      'prettier-plugin-ember-hbs-tag': '^1.0.0',
      'prettier-plugin-ember-template-tag': '^2.1.0',
    },
    devDependencies: {
      prettier: '^3.6.2',
    },
    peerDependencies: {
      prettier: '^3.0.0',
    },
  };

  const packageType = getPackageType(packageJson);

  assert.strictEqual(packageType, 'node');
});
