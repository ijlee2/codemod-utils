import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../../src/index.js';

test('files | map-file-paths > edge case (no match)', function () {
  const filePaths = ['.addon/index.js', 'addon', 'addon.js', 'app/index.js'];

  const filePathMap = mapFilePaths(filePaths, {
    from: 'addon',
    to: 'new-location/src',
  });

  assert.deepStrictEqual(
    filePathMap,
    new Map([
      ['.addon/index.js', '.addon/index.js'],
      ['addon', 'addon'],
      ['addon.js', 'addon.js'],
      ['app/index.js', 'app/index.js'],
    ]),
  );
});
