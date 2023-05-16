import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../../src/index.js';

test('files | map-file-paths > edge case (to is empty)', function () {
  const filePaths = ['addon/some-folder/some-file.ts', 'addon/.gitkeep'];

  const filePathMap = mapFilePaths(filePaths, {
    from: 'addon',
    to: '',
  });

  const expectedValue = new Map([
    ['addon/some-folder/some-file.ts', 'some-folder/some-file.ts'],
    ['addon/.gitkeep', '.gitkeep'],
  ]);

  assert.deepStrictEqual(filePathMap, expectedValue);
});
