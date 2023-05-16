import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../../src/index.js';

test('files | map-file-paths > edge case (from is empty)', function () {
  const filePaths = ['addon/some-folder/some-file.ts', 'addon/.gitkeep'];

  const filePathMap = mapFilePaths(filePaths, {
    from: '',
    to: 'new-location/src',
  });

  const expectedValue = new Map([
    [
      'addon/some-folder/some-file.ts',
      'new-location/src/addon/some-folder/some-file.ts',
    ],
    ['addon/.gitkeep', 'new-location/src/addon/.gitkeep'],
  ]);

  assert.deepStrictEqual(filePathMap, expectedValue);
});
