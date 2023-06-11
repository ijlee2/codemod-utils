import { assert, loadFixture, test } from '@codemod-utils/tests';

import { findFiles } from '../../../src/index.js';
import { codemodOptions, options } from '../../shared-test-setups/index.js';

test('files | find-files > error handling (pattern is undefined)', function () {
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
      // @ts-expect-error: Want to check the error message
      findFiles(undefined, {
        projectRoot: options.projectRoot,
      });
    },
    (error: Error) => {
      assert.strictEqual(
        error.message,
        'ERROR: The glob pattern is undefined.\n',
      );

      return true;
    },
  );
});
