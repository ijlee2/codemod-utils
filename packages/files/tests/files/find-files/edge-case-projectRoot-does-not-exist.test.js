import { assert, loadFixture, test } from '@codemod-utils/tests';

import { findFiles } from '../../../src/index.js';
import { codemodOptions } from '../../shared-test-setups/index.js';

test('files | find-files > edge case (projectRoot does not exist)', function () {
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

  const filePaths = findFiles('tests/dummy/**/*.{js,ts}', {
    projectRoot: 'foo',
  });

  assert.deepStrictEqual(filePaths, []);
});
