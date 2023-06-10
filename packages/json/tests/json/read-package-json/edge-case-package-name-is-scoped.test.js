import { assert, loadFixture, test } from '@codemod-utils/tests';

import { readPackageJson } from '../../../src/index.js';
import { codemodOptions, options } from '../../shared-test-setups/index.js';

test('json | read-package-json > edge case (package name is scoped)', function () {
  const inputProject = {
    'package.json': JSON.stringify(
      {
        name: '@ijlee2/ember-container-query',
        version: '3.2.0',
        dependencies: {
          'ember-cli-babel': '^7.26.11',
          'ember-cli-htmlbars': '^6.1.1',
        },
        devDependencies: {
          '@glint/core': '^v1.0.0-beta.2',
          typescript: '^4.9.4',
        },
        'ember-addon': {
          configPath: 'tests/dummy/config',
        },
      },
      null,
      2,
    ),
  };

  loadFixture(inputProject, codemodOptions);

  const packageJson = readPackageJson({
    projectRoot: options.projectRoot,
  });

  assert.deepStrictEqual(packageJson, {
    name: '@ijlee2/ember-container-query',
    version: '3.2.0',
    dependencies: {
      'ember-cli-babel': '^7.26.11',
      'ember-cli-htmlbars': '^6.1.1',
    },
    devDependencies: {
      '@glint/core': '^v1.0.0-beta.2',
      typescript: '^4.9.4',
    },
    'ember-addon': {
      configPath: 'tests/dummy/config',
    },
  });
});
