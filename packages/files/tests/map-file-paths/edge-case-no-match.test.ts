import { normalize } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../src/index.js';

test('map-file-paths > edge case (no match)', function () {
  const filePaths = [
    '.addon/index.js',
    'addon',
    'addon.js',
    'app/index.js',
  ].map(normalize);

  const filePathMap = mapFilePaths(filePaths, {
    from: 'addon',
    to: 'ember-container-query/src',
  });

  assert.deepStrictEqual(
    filePathMap,
    new Map([
      [normalize('.addon/index.js'), normalize('.addon/index.js')],
      [normalize('addon'), normalize('addon')],
      [normalize('addon.js'), normalize('addon.js')],
      [normalize('app/index.js'), normalize('app/index.js')],
    ]),
  );
});
