import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { createDirectory } from '../../../src/index.js';
import { codemodOptions } from '../../shared-test-setups/index.js';

test('files | create-directory > base case', function () {
  const inputProject = {};

  const outputProject = {
    addon: {
      components: {},
    },
  };

  loadFixture(inputProject, codemodOptions);

  const path = `${codemodOptions.projectRoot}/addon/components/ember-container-query.ts`;

  createDirectory(path);

  assertFixture(outputProject, codemodOptions);
});
