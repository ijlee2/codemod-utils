import { assert, test } from '@codemod-utils/tests';

import { decideVersion } from '../../../src/index.js';

test('blueprints | decide-version > edge case (package is already installed)', function () {
  const latestVersions = new Map([
    ['embroider-css-modules', '0.1.2'],
    ['webpack', '5.82.0'],
  ]);

  const version = decideVersion('webpack', {
    dependencies: new Map([['webpack', '^5.79.0']]),
    latestVersions,
  });

  assert.strictEqual(version, '^5.79.0');
});
