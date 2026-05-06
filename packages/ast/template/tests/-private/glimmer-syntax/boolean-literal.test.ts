/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert, test } from '@codemod-utils/tests';

import { parse, print } from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | BooleanLiteral > can be updated in MustacheStatement .path position', function () {
  const template = `{{true}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].path.value = false;

  assert.strictEqual(print(ast), `{{false}}`);
});

test('-private | glimmer-syntax | BooleanLiteral > can be updated in MustacheStatement .hash position', function () {
  const template = `{{foo thing=true}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].value.value = false;

  assert.strictEqual(print(ast), `{{foo thing=false}}`);
});
