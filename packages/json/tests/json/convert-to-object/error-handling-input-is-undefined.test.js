import { assert, test } from '@codemod-utils/tests';

import { convertToObject } from '../../../src/index.js';

test('json | convert-to-object > error handling (input is undefined)', function () {
  const devDependencies = undefined;

  const expectedValue = {};

  assert.deepStrictEqual(convertToObject(devDependencies), expectedValue);
});
