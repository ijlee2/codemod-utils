import { assert, test } from '@codemod-utils/tests';

import { convertToMap } from '../../../src/index.js';

test('json | convert-to-map > error handling (input is undefined)', function () {
  const devDependencies = undefined;

  const expectedValue = new Map();

  assert.deepEqual(convertToMap(devDependencies), expectedValue);
});
