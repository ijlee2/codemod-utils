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
} from '../../helpers/shared-test-setups/typescript.js';

test('migration | steps | create-files-from-blueprints > typescript', function () {
  const inputProject = {};

  const outputProject = convertFixtureToJson(
    'steps/create-files-from-blueprints/typescript/output',
  );

  loadFixture(inputProject, codemodOptions);

  createFilesFromBlueprints(options);

  assertFixture(outputProject, codemodOptions);
});
