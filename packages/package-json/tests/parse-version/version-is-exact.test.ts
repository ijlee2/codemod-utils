import { assert, test } from '@codemod-utils/tests';

import { parseVersion } from '../../src/index.js';

test('parse-version > version is exact', function () {
  assert.deepStrictEqual(parseVersion('0.0.0'), {
    major: 0,
    minor: 0,
    patch: 0,
    prefix: undefined,
  });

  assert.deepStrictEqual(parseVersion('1.2.3'), {
    major: 1,
    minor: 2,
    patch: 3,
    prefix: undefined,
  });

  assert.deepStrictEqual(parseVersion('12.345.5678'), {
    major: 12,
    minor: 345,
    patch: 5678,
    prefix: undefined,
  });

  assert.deepStrictEqual(parseVersion('12.345'), {
    major: 12,
    minor: 345,
    patch: 0,
    prefix: undefined,
  });

  assert.deepStrictEqual(parseVersion('12.345.z'), {
    major: 12,
    minor: 345,
    patch: 0,
    prefix: undefined,
  });

  assert.deepStrictEqual(parseVersion('12'), {
    major: 12,
    minor: 0,
    patch: 0,
    prefix: undefined,
  });

  assert.deepStrictEqual(parseVersion('12.y.z'), {
    major: 12,
    minor: 0,
    patch: 0,
    prefix: undefined,
  });
});
