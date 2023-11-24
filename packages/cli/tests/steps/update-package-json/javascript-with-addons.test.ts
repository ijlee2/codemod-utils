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
} from '../../helpers/shared-test-setups/javascript-with-addons.js';

test('migration | steps | update-package-json > javascript-with-addons', function () {
  const inputProject = convertFixtureToJson(
    'steps/update-package-json/javascript-with-addons/output',
  );

  const outputProject = convertFixtureToJson(
    'steps/update-package-json/javascript-with-addons/output',
  );

  loadFixture(inputProject, codemodOptions);

  updatePackageJson(options);

  assertFixture(outputProject, codemodOptions);
});
