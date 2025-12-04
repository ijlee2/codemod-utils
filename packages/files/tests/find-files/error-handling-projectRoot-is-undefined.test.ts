import { assert, loadFixture, test } from '@codemod-utils/tests';

import { findFiles } from '../../src/index.js';
import { codemodOptions } from '../helpers/index.js';

test('find-files > error handling (projectRoot is undefined)', function () {
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

  assert.throws(
    () => {
      findFiles('tests/dummy/**/*.{js,ts}', {
        // @ts-expect-error: Want to check the error message
        projectRoot: undefined,
      });
    },
    (error: Error) => {
      assert.strictEqual(
        error.message,
        'ERROR: The project root is undefined.',
      );

      return true;
    },
  );
});
