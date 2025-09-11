import { assert, test } from '@codemod-utils/tests';

import { getPackageType } from '../../src/index.js';

test('get-package-type > v2-addon', function () {
  const packageJson = {
    name: 'ember-container-query',
    version: '6.0.2',
    keywords: ['ember-addon'],
    dependencies: {
      '@embroider/addon-shim': '^1.10.0',
      'decorator-transforms': '^2.3.0',
    },
    devDependencies: {
      'ember-source': '^6.6.0',
    },
    ember: {
      edition: 'octane',
    },
    'ember-addon': {
      'app-js': {
        './components/container-query.js':
          './dist/_app_/components/container-query.js',
        './helpers/aspect-ratio.js': './dist/_app_/helpers/aspect-ratio.js',
        './helpers/height.js': './dist/_app_/helpers/height.js',
        './helpers/width.js': './dist/_app_/helpers/width.js',
        './modifiers/container-query.js':
          './dist/_app_/modifiers/container-query.js',
      },
      main: 'addon-main.cjs',
      type: 'addon',
      version: 2,
    },
  };

  const packageType = getPackageType(packageJson);

  assert.strictEqual(packageType, 'v2-addon');
});
