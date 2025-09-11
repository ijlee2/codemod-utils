import { assert, test } from '@codemod-utils/tests';

import { getPackageType } from '../../src/index.js';

test('get-package-type > v1-addon (ember-addon is missing)', function () {
  const packageJson = {
    name: 'ember-container-query',
    version: '3.2.0',
    keywords: ['ember-addon'],
    dependencies: {
      'ember-cli-babel': '^7.26.11',
      'ember-cli-htmlbars': '^6.1.1',
    },
    devDependencies: {
      'ember-source': '~4.8.0',
    },
    ember: {
      edition: 'octane',
    },
  };

  const packageType = getPackageType(packageJson);

  assert.strictEqual(packageType, 'v1-app');
});
