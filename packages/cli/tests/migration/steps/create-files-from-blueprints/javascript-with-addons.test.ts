import {
  assertFixture,
  convertFixtureToJson,
  loadFixture,
  test,
} from '@codemod-utils/tests';

import { createFilesFromBlueprints } from '../../../../src/migration/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../../helpers/shared-test-setups/javascript-with-addons.js';

test('migration | steps | create-files-from-blueprints > javascript-with-addons', function () {
  const inputProject = {};

  const outputProject = convertFixtureToJson(
    'steps/create-files-from-blueprints/javascript-with-addons/output',
  );

  loadFixture(inputProject, codemodOptions);

  createFilesFromBlueprints(options);

  assertFixture(outputProject, codemodOptions);
});
