/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { assert, normalizeFile, test } from '@codemod-utils/tests';

import {
  builders,
  parse,
  print,
} from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | SubExpression > rename path', function () {
  const template = normalizeFile([
    `{{foo-bar`,
    `  baz=(stuff`,
    `    goes='here')`,
    `}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].value.path = builders.path('zomg');

  assert.strictEqual(
    print(ast),
    normalizeFile([`{{foo-bar`, `  baz=(zomg`, `    goes='here')`, `}}`]),
  );
});

test('-private | glimmer-syntax | SubExpression > can add param', function () {
  const template = normalizeFile([
    `{{foo-bar`,
    `  baz=(stuff`,
    `    goes='here')`,
    `}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].value.params.push(builders.path('zomg'));

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `{{foo-bar`,
      `  baz=(stuff`,
      `    zomg`,
      `    goes='here')`,
      `}}`,
    ]),
  );
});

test('-private | glimmer-syntax | SubExpression > can remove param', function () {
  const template = normalizeFile([
    `{{foo-bar`,
    `  baz=(stuff`,
    `    hhaahahaha`,
    `    goes='here')`,
    `}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].value.params.pop();

  assert.strictEqual(
    print(ast),
    normalizeFile([`{{foo-bar`, `  baz=(stuff`, `    goes='here')`, `}}`]),
  );
});

test('-private | glimmer-syntax | SubExpression > replacing empty hash pair', function () {
  const template = normalizeFile([`{{foo-bar`, `  baz=(stuff)`, `}}`]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].value.hash = builders.hash([
    builders.pair('hello', builders.string('world')),
  ]);

  assert.strictEqual(
    print(ast),
    normalizeFile([`{{foo-bar`, `  baz=(stuff hello="world")`, `}}`]),
  );
});
