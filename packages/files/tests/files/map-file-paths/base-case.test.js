import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../../src/index.js';

test('files | map-file-paths > base case', function () {
  const filePaths = ['addon/some-folder/some-file.ts', 'addon/.gitkeep'];

  const filePathMap = mapFilePaths(filePaths, {
    from: 'addon',
    to: 'new-location/src',
  });

  assert.deepStrictEqual(
    filePathMap,
    new Map([
      [
        'addon/some-folder/some-file.ts',
        'new-location/src/some-folder/some-file.ts',
      ],
      ['addon/.gitkeep', 'new-location/src/.gitkeep'],
    ]),
  );
});
