import { normalize } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../src/index.js';

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
    new Map([
      [
        normalize('addon/components/container-query.hbs'),
        normalize('ember-container-query/src/components/container-query.hbs'),
      ],
      [
        normalize('addon/.gitkeep'),
        normalize('ember-container-query/src/.gitkeep'),
      ],
    ]),
  );
});
