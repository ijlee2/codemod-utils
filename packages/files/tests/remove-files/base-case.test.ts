import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { removeFiles } from '../../src/index.js';
import { codemodOptions, options } from '../helpers/index.js';

test('remove-files > base case', function () {
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
    app: {
      components: {
        'container-query.js': 'some code for container-query.js',
      },
    },
  };

  loadFixture(inputProject, codemodOptions);

  const filePaths = [
    'addon/components/container-query.hbs',
    'addon/components/container-query.ts',
  ];

  removeFiles(filePaths, options);

  assertFixture(outputProject, codemodOptions);
});
