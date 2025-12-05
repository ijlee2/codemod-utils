import { normalize } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../src/index.js';
import { normalizeFilePathMap } from '../helpers/index.js';

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
    normalizeFilePathMap(
      new Map([
        ['.addon/index.js', '.addon/index.js'],
        ['addon', 'addon'],
        ['addon.js', 'addon.js'],
        ['app/index.js', 'app/index.js'],
      ]),
    ),
  );
});
