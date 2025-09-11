import { assert, test } from '@codemod-utils/tests';

import { getPackageType } from '../../src/index.js';

test('get-package-type > v2-app (vite)', function () {
  const packageJson = {
    name: 'my-app',
    version: '1.0.0',
    devDependencies: {
      '@embroider/vite': '^1.2.0',
      'ember-source': '~6.7.0',
      vite: '^6.3.5',
    },
    ember: {
      edition: 'octane',
    },
  };

  const packageType = getPackageType(packageJson);

  assert.strictEqual(packageType, 'v2-app');
});
