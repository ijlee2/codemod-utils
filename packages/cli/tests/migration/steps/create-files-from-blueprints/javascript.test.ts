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
} from '../../../helpers/shared-test-setups/javascript.js';

test('migration | steps | create-files-from-blueprints > javascript', function () {
  const inputProject = {};

  const outputProject = convertFixtureToJson(
    'steps/create-files-from-blueprints/javascript/output',
  );

  loadFixture(inputProject, codemodOptions);

  createFilesFromBlueprints(options);

  assertFixture(outputProject, codemodOptions);
});
