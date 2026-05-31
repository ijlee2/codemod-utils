import { assert, test } from '@codemod-utils/tests';

import { parseVersion } from '../../src/index.js';

test('parse-version > version has identifier', function () {
  assert.deepStrictEqual(parseVersion('^1.2.3-alpha'), {
    major: 1,
    minor: 2,
    patch: 3,
    prefix: '^',
  });

  assert.deepStrictEqual(parseVersion('~1.2.3-beta.1'), {
    major: 1,
    minor: 2,
    patch: 3,
    prefix: '~',
  });

  assert.deepStrictEqual(parseVersion('1.2.3-4.5.6'), {
    major: 1,
    minor: 2,
    patch: 3,
    prefix: undefined,
  });

  assert.deepStrictEqual(parseVersion('^1.2.3-x.5.z.78'), {
    major: 1,
    minor: 2,
    patch: 3,
    prefix: '^',
  });

  assert.deepStrictEqual(parseVersion('~1.2.3-alpha+001'), {
    major: 1,
    minor: 2,
    patch: 3,
    prefix: '~',
  });

  assert.deepStrictEqual(parseVersion('1.2.3+20260531144700'), {
    major: 1,
    minor: 2,
    patch: 3,
    prefix: undefined,
  });
});
