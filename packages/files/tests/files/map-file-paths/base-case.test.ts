import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../../src/index.js';

test('files | map-file-paths > base case', function () {
  const filePaths = ['addon/components/container-query.hbs', 'addon/.gitkeep'];

  const filePathMap = mapFilePaths(filePaths, {
    from: 'addon',
    to: 'ember-container-query/src',
  });

  assert.deepStrictEqual(
    filePathMap,
    new Map([
      [
        'addon/components/container-query.hbs',
        'ember-container-query/src/components/container-query.hbs',
      ],
      ['addon/.gitkeep', 'ember-container-query/src/.gitkeep'],
    ]),
  );
});
