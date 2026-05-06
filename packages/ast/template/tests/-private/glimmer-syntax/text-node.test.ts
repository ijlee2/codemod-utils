/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { assert, test } from '@codemod-utils/tests';

import { parse, print } from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | TextNode > can be updated', function () {
  const template = `Foo`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].chars = 'Bar';

  assert.strictEqual(print(ast), 'Bar');
});

test('-private | glimmer-syntax | TextNode > can be updated as value of AttrNode', function () {
  const template = `<div class="lol"></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.chars = 'hahah';

  assert.strictEqual(print(ast), '<div class="hahah"></div>');
});

test('-private | glimmer-syntax | TextNode > an AttrNode values quotes are removed when inserted in alternate positions (e.g. content)', function () {
  const template = `<div class="lol"></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  const text = ast.body[0].attributes[0].value;
  // @ts-expect-error: Incorrect type
  ast.body[0].children.push(text);

  assert.strictEqual(print(ast), '<div class="lol">lol</div>');
});
