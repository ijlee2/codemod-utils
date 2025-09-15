import { assert, test } from '@codemod-utils/tests';

import { getPackageType } from '../../src/index.js';

test('get-package-type > v1-addon (version is 1)', function () {
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
    'ember-addon': {
      version: 1,
    },
  };

  const packageType = getPackageType(packageJson);

  assert.strictEqual(packageType, 'v1-addon');
});
