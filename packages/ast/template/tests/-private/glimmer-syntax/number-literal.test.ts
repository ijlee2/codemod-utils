/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert, test } from '@codemod-utils/tests';

import { parse, print } from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | NumberLiteral > can be updated', function () {
  const template = `{{foo 42}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].params[0].value = 0;

  assert.strictEqual(print(ast), `{{foo 0}}`);
});
