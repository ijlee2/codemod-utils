import { normalize } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../src/index.js';
import { normalizeFilePathMap } from '../helpers/index.js';

test('map-file-paths > edge case (to is empty)', function () {
  const filePaths = [
    'package.json',
    'ember-container-query/package.json',
    'ember-container-query/ember-container-query/package.json',
  ].map(normalize);

  const filePathMap = mapFilePaths(filePaths, {
    from: 'ember-container-query',
    to: '',
  });

  assert.deepStrictEqual(
    filePathMap,
    normalizeFilePathMap(
      new Map([
        ['package.json', 'package.json'],
        ['ember-container-query/package.json', 'package.json'],
        [
          'ember-container-query/ember-container-query/package.json',
          'ember-container-query/package.json',
        ],
      ]),
    ),
  );
});
