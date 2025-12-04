import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths, normalizeFilePath } from '../../src/index.js';

test('map-file-paths > base case', function () {
  const filePaths = [
    'addon/components/container-query.hbs',
    'addon/.gitkeep',
  ].map(normalizeFilePath);

  const filePathMap = mapFilePaths(filePaths, {
    from: 'addon',
    to: 'ember-container-query/src',
  });

  assert.deepStrictEqual(
    filePathMap,
    new Map([
      [
        normalizeFilePath('addon/components/container-query.hbs'),
        normalizeFilePath(
          'ember-container-query/src/components/container-query.hbs',
        ),
      ],
      [
        normalizeFilePath('addon/.gitkeep'),
        normalizeFilePath('ember-container-query/src/.gitkeep'),
      ],
    ]),
  );
});
