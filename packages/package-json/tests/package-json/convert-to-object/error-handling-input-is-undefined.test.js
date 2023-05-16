import { assert, test } from '@codemod-utils/tests';

import { convertToObject } from '../../../src/index.js';

test('package-json | convert-to-object > error handling (input is undefined)', function () {
  const devDependencies = undefined;

  const expectedValue = {};

  assert.deepEqual(convertToObject(devDependencies), expectedValue);
});
