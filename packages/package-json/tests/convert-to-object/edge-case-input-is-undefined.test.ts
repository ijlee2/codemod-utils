import { assert, test } from '@codemod-utils/tests';

import { convertToObject } from '../../src/index.js';

test('convert-to-object > edge case (input is undefined)', function () {
  const devDependencies = undefined;

  const expectedValue = {};

  assert.deepStrictEqual(convertToObject(devDependencies), expectedValue);
});
