import {
  assertFixture,
  convertFixtureToJson,
  loadFixture,
  test,
} from '@codemod-utils/tests';

import { updatePackageJson } from '../../../src/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../helpers/shared-test-setups/javascript.js';

test('migration | steps | update-package-json > javascript', function () {
  const inputProject = convertFixtureToJson(
    'steps/update-package-json/javascript/output',
  );

  const outputProject = convertFixtureToJson(
    'steps/update-package-json/javascript/output',
  );

  loadFixture(inputProject, codemodOptions);

  updatePackageJson(options);

  assertFixture(outputProject, codemodOptions);
});
