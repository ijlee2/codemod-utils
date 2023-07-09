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
} from '../../../helpers/shared-test-setups/typescript.js';

test('migration | steps | update-package-json > typescript', function () {
  const inputProject = convertFixtureToJson(
    'steps/update-package-json/typescript/output',
  );

  const outputProject = convertFixtureToJson(
    'steps/update-package-json/typescript/output',
  );

  loadFixture(inputProject, codemodOptions);

  updatePackageJson(options);

  assertFixture(outputProject, codemodOptions);
});
