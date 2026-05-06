/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { assert, test } from '@codemod-utils/tests';

import {
  builders,
  parse,
  print,
} from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | StringLiteral > can be updated', function () {
  const template = `{{foo "blah"}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].params[0].value = 'derp';

  assert.strictEqual(print(ast), `{{foo "derp"}}`);
});

test('-private | glimmer-syntax | StringLiteral > can determine type of quotes used from AST (required by ember-template-lint)', function () {
  // @ts-expect-error: Incorrect type
  assert.strictEqual(parse(`{{foo "blah"}}`).body[0].params[0].quoteType, '"');

  // @ts-expect-error: Incorrect type
  assert.strictEqual(parse(`{{foo 'blah'}}`).body[0].params[0].quoteType, "'");
});

test('-private | glimmer-syntax | StringLiteral > can update quote style', function () {
  let ast = parse(`{{foo "blah"}}`);

  // @ts-expect-error: Incorrect type
  ast.body[0].params[0].quoteType = "'";

  assert.strictEqual(print(ast), `{{foo 'blah'}}`);

  ast = parse(`{{foo 'blah'}}`);

  // @ts-expect-error: Incorrect type
  ast.body[0].params[0].quoteType = '"';

  assert.strictEqual(print(ast), `{{foo "blah"}}`);
});

test('-private | glimmer-syntax | StringLiteral > can specify quote style on a new string literal', function () {
  const ast = parse(`{{foo}}`);

  const s = builders.string('blah');
  // @ts-expect-error: Incorrect type
  s.quoteType = "'";
  // @ts-expect-error: Incorrect type
  ast.body[0].params.push(s);

  assert.strictEqual(print(ast), `{{foo 'blah'}}`);
});
