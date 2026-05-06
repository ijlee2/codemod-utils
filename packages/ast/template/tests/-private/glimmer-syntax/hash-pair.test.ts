/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert, test } from '@codemod-utils/tests';

import { parse, print } from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | HashPair > mutations', function () {
  const template = '{{foo-bar bar=foo}}';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].value.original = 'bar';

  assert.strictEqual(print(ast), '{{foo-bar bar=bar}}');
});

test('-private | glimmer-syntax | HashPair > mutations retain formatting', function () {
  const template = '{{foo-bar   bar= foo}}';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].value.original = 'bar';

  assert.strictEqual(print(ast), '{{foo-bar   bar= bar}}');
});
