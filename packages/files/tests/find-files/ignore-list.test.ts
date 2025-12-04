import { assert, loadFixture, test } from '@codemod-utils/tests';

import { findFiles, normalizeFilePath } from '../../src/index.js';
import { codemodOptions, options } from '../helpers/index.js';

test('find-files > ignore list', function () {
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

  const filePaths = findFiles('tests/**/*.{js,ts}', {
    ignoreList: ['tests/dummy/**/*'],
    projectRoot: options.projectRoot,
  });

  assert.deepStrictEqual(
    filePaths,
    [
      'tests/integration/components/container-query-test.ts',
      'tests/test-helper.ts',
    ].map(normalizeFilePath),
  );
});
