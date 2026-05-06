/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { assert, normalizeFile, test } from '@codemod-utils/tests';

import {
  builders,
  parse,
  print,
} from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | ConcatStatement > can add parts', function () {
  const template = `<div class="foo {{bar}}"></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.parts.push(builders.text(' baz'));

  assert.strictEqual(print(ast), `<div class="foo {{bar}} baz"></div>`);
});

test('-private | glimmer-syntax | ConcatStatement > preserves quote style', function () {
  const template = `<div class='foo {{bar}}'></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.parts.push(builders.text(' baz'));

  assert.strictEqual(print(ast), `<div class='foo {{bar}} baz'></div>`);
});

test('-private | glimmer-syntax | ConcatStatement > updating parts preserves custom whitespace', function () {
  const template = normalizeFile([`<div class="foo {{`, `bar`, `}}"></div>`]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.parts.push(builders.text(' baz'));

  assert.strictEqual(
    print(ast),
    normalizeFile([`<div class="foo {{`, `bar`, `}} baz"></div>`]),
  );
});
