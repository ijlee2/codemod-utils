import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { removeFiles } from '../../src/index.js';
import { codemodOptions, options } from '../helpers/index.js';

test('remove-files > edge case (file does not exist)', function () {
  const inputProject = {
    addon: {
      components: {
        'container-query.css': 'some code for container-query.css',
        'container-query.ts': 'some code for container-query.ts',
      },
    },
  };

  const outputProject = {
    addon: {
      components: {
        'container-query.css': 'some code for container-query.css',
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
