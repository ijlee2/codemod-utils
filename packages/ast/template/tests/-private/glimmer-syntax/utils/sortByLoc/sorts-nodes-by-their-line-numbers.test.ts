import { assert, test } from '@codemod-utils/tests';
import { builders } from '@glimmer/syntax';

import { sortByLoc } from '../../../../../src/-private/glimmer-syntax/utils.js';

test('-private | glimmer-syntax | utils | sortByLoc > sorts nodes by their line numbers', function () {
  const a = builders.pair(
    'a',
    builders.path('foo'),
    builders.loc(1, 1, 1, 5, 'foo.hbs'),
  );

  const b = builders.pair(
    'b',
    builders.path('foo'),
    builders.loc(3, 1, 1, 5, 'foo.hbs'),
  );

  const c = builders.pair(
    'c',
    builders.path('foo'),
    builders.loc(2, 1, 1, 5, 'foo.hbs'),
  );

  const nodes = [a, b, c].sort(sortByLoc);

  assert.deepStrictEqual(
    nodes.map((node) => node.key),
    ['a', 'c', 'b'],
  );
});
