import { assert, test } from '@codemod-utils/tests';

import { getPackageType } from '../../src/index.js';

test('get-package-type > v1-app (classic)', function () {
  const packageJson = {
    name: 'my-app',
    version: '1.0.0',
    devDependencies: {
      'ember-source': '~4.12.0',
      webpack: '^5.88.2',
    },
    ember: {
      edition: 'octane',
    },
  };

  const packageType = getPackageType(packageJson);

  assert.strictEqual(packageType, 'v1-app');
});
