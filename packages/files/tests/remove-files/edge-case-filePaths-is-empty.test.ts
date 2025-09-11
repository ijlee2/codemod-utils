import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { removeFiles } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('remove-files > edge case (filePaths is empty)', function () {
  const inputProject = {
    addon: {
      components: {
        'container-query.hbs': 'some code for container-query.hbs',
        'container-query.ts': 'some code for container-query.ts',
      },
    },

    app: {
      components: {
        'container-query.js': 'some code for container-query.js',
      },
    },
  };

  const outputProject = {
    addon: {
      components: {
        'container-query.hbs': 'some code for container-query.hbs',
        'container-query.ts': 'some code for container-query.ts',
      },
    },

    app: {
      components: {
        'container-query.js': 'some code for container-query.js',
      },
    },
  };

  loadFixture(inputProject, codemodOptions);

  const filePaths: string[] = [];

  removeFiles(filePaths, options);

  assertFixture(outputProject, codemodOptions);
});
