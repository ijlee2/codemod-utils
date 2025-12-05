import { normalize } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../src/index.js';
import { normalizeFilePathMap } from '../helpers/index.js';

test('map-file-paths > base case', function () {
  const filePaths = [
    'addon/components/container-query.hbs',
    'addon/.gitkeep',
  ].map(normalize);

  const filePathMap = mapFilePaths(filePaths, {
    from: 'addon',
    to: 'ember-container-query/src',
  });

  assert.deepStrictEqual(
    filePathMap,
    normalizeFilePathMap(
      new Map([
        [
          'addon/components/container-query.hbs',
          'ember-container-query/src/components/container-query.hbs',
        ],
        ['addon/.gitkeep', 'ember-container-query/src/.gitkeep'],
      ]),
    ),
  );
});
