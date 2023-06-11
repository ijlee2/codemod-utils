import { assert, test } from '@codemod-utils/tests';

import { decideVersion } from '../../../src/index.js';

test('blueprints | decide-version > error handling (latest version is undefined)', function () {
  const latestVersions = new Map([
    ['embroider-css-modules', '0.1.2'],
    ['webpack', '5.82.0'],
  ]);

  assert.throws(
    () => {
      decideVersion('type-css-modules', {
        dependencies: new Map([['webpack', '^5.79.0']]),
        latestVersions,
      });
    },
    (error: Error) => {
      assert.strictEqual(
        error.message,
        'ERROR: The latest version of `type-css-modules` is unknown.\n',
      );

      return true;
    },
  );
});
