import { normalize } from 'node:path';

import { assert, test } from '@codemod-utils/tests';

import { mapFilePaths } from '../../src/index.js';

test('map-file-paths > edge case (from is empty)', function () {
  const filePaths = [
    'package.json',
    'ember-container-query/package.json',
    'ember-container-query/ember-container-query/package.json',
  ].map(normalize);

  const filePathMap = mapFilePaths(filePaths, {
    from: '',
    to: 'ember-container-query',
  });

  assert.deepStrictEqual(
    filePathMap,
    new Map([
      [
        normalize('package.json'),
        normalize('ember-container-query/package.json'),
      ],
      [
        normalize('ember-container-query/package.json'),
        normalize('ember-container-query/ember-container-query/package.json'),
      ],
      [
        normalize('ember-container-query/ember-container-query/package.json'),
        normalize(
          'ember-container-query/ember-container-query/ember-container-query/package.json',
        ),
      ],
    ]),
  );
});
