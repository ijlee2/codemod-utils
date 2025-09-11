import { assert, test } from '@codemod-utils/tests';

import { decideVersion } from '../../src/index.js';

test('decide-version > base case', function () {
  const latestVersions = new Map([
    ['embroider-css-modules', '0.1.2'],
    ['webpack', '5.82.0'],
  ]);

  const version = decideVersion('embroider-css-modules', {
    dependencies: new Map([['webpack', '^5.79.0']]),
    latestVersions,
  });

  assert.strictEqual(version, '^0.1.2');
});
