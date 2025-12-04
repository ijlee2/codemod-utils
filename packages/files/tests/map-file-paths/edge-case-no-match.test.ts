import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths, normalizeFilePath } from '../../src/index.js';

test('map-file-paths > edge case (no match)', function () {
  const filePaths = [
    '.addon/index.js',
    'addon',
    'addon.js',
    'app/index.js',
  ].map(normalizeFilePath);

  const filePathMap = mapFilePaths(filePaths, {
    from: 'addon',
    to: 'ember-container-query/src',
  });

  assert.deepStrictEqual(
    filePathMap,
    new Map([
      [
        normalizeFilePath('.addon/index.js'),
        normalizeFilePath('.addon/index.js'),
      ],
      [normalizeFilePath('addon'), normalizeFilePath('addon')],
      [normalizeFilePath('addon.js'), normalizeFilePath('addon.js')],
      [normalizeFilePath('app/index.js'), normalizeFilePath('app/index.js')],
    ]),
  );
});
