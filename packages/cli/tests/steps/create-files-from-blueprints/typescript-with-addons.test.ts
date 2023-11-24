import {
  assertFixture,
  convertFixtureToJson,
  loadFixture,
  test,
} from '@codemod-utils/tests';

import { createFilesFromBlueprints } from '../../../src/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../helpers/shared-test-setups/typescript-with-addons.js';

test('migration | steps | create-files-from-blueprints > typescript-with-addons', function () {
  const inputProject = {};

  const outputProject = convertFixtureToJson(
    'steps/create-files-from-blueprints/typescript-with-addons/output',
  );

  loadFixture(inputProject, codemodOptions);

  createFilesFromBlueprints(options);

  assertFixture(outputProject, codemodOptions);
});
