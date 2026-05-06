import { assert, test } from '@codemod-utils/tests';
import { builders } from '@glimmer/syntax';

import { sortByLoc } from '../../../../../src/-private/glimmer-syntax/utils.js';

test('-private | glimmer-syntax | utils | sortByLoc > sorts synthetic nodes last', function () {
  const a = builders.pair('a', builders.path('foo') /* no loc, "synthetic" */);

  const b = builders.pair(
    'b',
    builders.path('foo'),
    builders.loc(1, 1, 1, 5, 'foo.hbs'),
  );

  const nodes = [a, b].sort(sortByLoc);

  assert.deepStrictEqual(
    nodes.map((node) => node.key),
    ['a', 'b'],
  );
});
