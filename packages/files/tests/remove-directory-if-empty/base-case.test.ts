import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { removeDirectoryIfEmpty } from '../../src/index.js';
import { codemodOptions, options } from '../helpers/index.js';

test('remove-directory-if-empty > base case', function () {
  const inputProject = {
    addon: {
      components: {},
    },
  };

  const outputProject = {};

  loadFixture(inputProject, codemodOptions);

  removeDirectoryIfEmpty('addon/components/container-query.ts', options);

  assertFixture(outputProject, codemodOptions);
});
