import {
  assertFixture,
  convertFixtureToJson,
  loadFixture,
  test,
} from '@codemod-utils/tests';

import { updatePackageJson } from '../../../../src/migration/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../../helpers/shared-test-setups/typescript-with-addons.js';

test('migration | steps | update-package-json > typescript-with-addons', function () {
  const inputProject = convertFixtureToJson(
    'steps/update-package-json/typescript-with-addons/output',
  );

  const outputProject = convertFixtureToJson(
    'steps/update-package-json/typescript-with-addons/output',
  );

  loadFixture(inputProject, codemodOptions);

  updatePackageJson(options);

  assertFixture(outputProject, codemodOptions);
});
