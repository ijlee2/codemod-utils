import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { removeDirectoryIfEmpty } from '../../../src/index.js';
import { codemodOptions, options } from '../../shared-test-setups/index.js';

test('files | remove-directory-if-empty > edge case (parent directory is not empty)', function () {
  const inputProject = {
    addon: {
      components: {},
      '.gitkeep': '',
    },
  };

  const outputProject = {
    addon: {
      '.gitkeep': '',
    },
  };

  loadFixture(inputProject, codemodOptions);

  removeDirectoryIfEmpty('addon/components/container-query.ts', options);

  assertFixture(outputProject, codemodOptions);
});
