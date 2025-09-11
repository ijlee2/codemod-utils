import { assert, loadFixture, test } from '@codemod-utils/tests';

import { findFiles } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('find-files > multiple patterns', function () {
  const inputProject = {
    tests: {
      dummy: {
        app: {
          '.eslintrc.js': '',
          'app.ts': '',
          'index.html': '',
          'router.ts': '',
        },
        config: {
          'environment.js': '',
          'optional-features.json': '',
          'targets.js': '',
        },
      },
      integration: {
        components: {
          'container-query-test.ts': '',
        },
      },
      'index.html': '',
      'test-helper.ts': '',
    },
    'ember-cli-build.js': '',
    'index.js': '',
    'package.json': '',
  };

  loadFixture(inputProject, codemodOptions);

  const filePaths = findFiles(['**/*.json', '**/index.*'], {
    projectRoot: options.projectRoot,
  });

  assert.deepStrictEqual(filePaths, [
    'index.js',
    'package.json',
    'tests/dummy/app/index.html',
    'tests/dummy/config/optional-features.json',
    'tests/index.html',
  ]);
});
