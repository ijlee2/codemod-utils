import { assert, test } from '@codemod-utils/tests';

import { getPackageType } from '../../src/index.js';

test('get-package-type > v1-app (webpack)', function () {
  const packageJson = {
    name: 'my-app',
    version: '1.0.0',
    devDependencies: {
      '@embroider/webpack': '^4.1.1',
      'ember-source': '~6.7.0',
      webpack: '^5.101.0',
    },
    ember: {
      edition: 'octane',
    },
  };

  const packageType = getPackageType(packageJson);

  assert.strictEqual(packageType, 'v1-app');
});
