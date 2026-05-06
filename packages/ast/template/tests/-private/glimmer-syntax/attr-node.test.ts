/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { assert, normalizeFile, test } from '@codemod-utils/tests';
import type { AST } from '@glimmer/syntax';

import {
  builders,
  parse,
  print,
} from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | AttrNode > updating value', function () {
  const template = '<Foo bar={{foo}} />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.path.original = 'bar';

  assert.strictEqual(print(ast), '<Foo bar={{bar}} />');
});

test('-private | glimmer-syntax | AttrNode > updating attribute to be valueless', function () {
  const template = '<Foo data-foo="bar" />';
  let ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].isValueless = true;

  assert.strictEqual(print(ast), '<Foo data-foo />');

  ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].isValueless = true;
  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.text('blah');

  assert.strictEqual(print(ast), '<Foo data-foo />');
});

test('-private | glimmer-syntax | AttrNode > adding value to valueless attribute', function () {
  const template = '<Foo data-foo />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.mustache('true');

  assert.strictEqual(print(ast), '<Foo data-foo={{true}} />');
});

test('-private | glimmer-syntax | AttrNode > updating valueless attribute to a mustache statement does not add quotes', function () {
  const template = '<Foo data-foo />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].isValueless = false;
  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.mustache('true');

  assert.strictEqual(print(ast), '<Foo data-foo={{true}} />');
});

test('-private | glimmer-syntax | AttrNode > modifying valueless attribute to have empty value', function () {
  const template = '<Foo data-foo />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].isValueless = false;

  assert.strictEqual(print(ast), '<Foo data-foo="" />');
});

test('-private | glimmer-syntax | AttrNode > updating concat statement value', function () {
  const template = '<Foo class="{{foo}} static {{bar}}" />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.parts.push(builders.text(' other-static'));

  assert.strictEqual(
    print(ast),
    '<Foo class="{{foo}} static {{bar}} other-static" />',
  );
});

test('-private | glimmer-syntax | AttrNode > updating value from non-quotable to TextNode (GH#111)', function () {
  const template = '<Foo bar={{foo}} />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.text('hello!');

  assert.strictEqual(print(ast), '<Foo bar="hello!" />');
});

test('-private | glimmer-syntax | AttrNode > updating value from non-quotable to ConcatStatement (GH#111)', function () {
  const template = '<Foo bar={{foo}} />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.concat([
    builders.mustache('foo'),
    builders.text(' static '),
    builders.mustache('bar'),
  ]);

  assert.strictEqual(print(ast), '<Foo bar="{{foo}} static {{bar}}" />');
});

test('-private | glimmer-syntax | AttrNode > can determine if an AttrNode was valueless (required by ember-template-lint)', function () {
  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar={{foo}} />`).body[0].attributes[0].isValueless,
    false,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar="foo {{bar}}" />`).body[0].attributes[0].isValueless,
    false,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar='foo {{bar}}' />`).body[0].attributes[0].isValueless,
    false,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar="foo" />`).body[0].attributes[0].isValueless,
    false,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar='foo' />`).body[0].attributes[0].isValueless,
    false,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar=foo />`).body[0].attributes[0].isValueless,
    false,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar />`).body[0].attributes[0].isValueless,
    true,
  );
});

test('-private | glimmer-syntax | AttrNode > can determine type of quotes used from AST (required by ember-template-lint)', function () {
  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar={{foo}} />`).body[0].attributes[0].quoteType,
    null,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar="foo {{bar}}" />`).body[0].attributes[0].quoteType,
    `"`,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar='foo {{bar}}' />`).body[0].attributes[0].quoteType,
    `'`,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar="foo" />`).body[0].attributes[0].quoteType,
    `"`,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar='foo' />`).body[0].attributes[0].quoteType,
    `'`,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar=foo />`).body[0].attributes[0].quoteType,
    null,
  );

  assert.strictEqual(
    // @ts-expect-error: Incorrect type
    parse(`<Foo bar />`).body[0].attributes[0].quoteType,
    null,
  );
});

test('-private | glimmer-syntax | AttrNode > renaming valueless attribute', function () {
  const template = '<Foo data-bar />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].name = 'data-foo';

  assert.strictEqual(print(ast), '<Foo data-foo />');
});

test('-private | glimmer-syntax | AttrNode > mutations retain custom whitespace formatting', function () {
  const template = normalizeFile([`<Foo `, `  bar = {{ foo }} />`]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.path.original = 'bar';

  assert.strictEqual(
    print(ast),
    normalizeFile([`<Foo `, `  bar = {{ bar }} />`]),
  );
});

test('-private | glimmer-syntax | AttrNode > mutations retain textarea whitespace formatting', function () {
  const template = normalizeFile([`<textarea name="foo">`, `</textarea>`]);
  const ast = parse(template);

  const element = ast.body[0] as AST.ElementNode;
  const attrNode = element.attributes[0] as AST.AttrNode;
  const attrValue = attrNode.value as AST.TextNode;
  attrValue.chars = 'bar';

  assert.strictEqual(
    print(ast),
    normalizeFile([`<textarea name="bar">`, `</textarea>`]),
  );
});

test('-private | glimmer-syntax | AttrNode > mutations in MustacheStatements retain whitespace in AttrNode', function () {
  const template = normalizeFile([
    `<div`,
    `  class="`,
    `    block`,
    `    {{if this.foo "bar"}}`,
    `  "`,
    `>`,
    `  hello`,
    `</div>`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.parts[1].params[1].value = 'bar';

  assert.strictEqual(print(ast), template);
});

test('-private | glimmer-syntax | AttrNode > quotes are preserved when updated a TextNode value (double quote)', function () {
  const template = `<div class="lol"></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.chars = 'hahah';

  assert.strictEqual(print(ast), '<div class="hahah"></div>');
});

test('-private | glimmer-syntax | AttrNode > quotes are preserved when updated a TextNode value (single quote)', function () {
  const template = `<div class='lol'></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.chars = 'hahah';

  assert.strictEqual(print(ast), `<div class='hahah'></div>`);
});

test('-private | glimmer-syntax | AttrNode > can update a quoteless attribute value', function () {
  const template = `<div class=wat></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.chars = 'zomgyasss';

  assert.strictEqual(print(ast), '<div class=zomgyasss></div>');
});

test('-private | glimmer-syntax | AttrNode > quoteless attribute values can be updated to a must-quote attribute value', function () {
  const template = `<div class=wat></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.chars = 'foo bar baz';

  assert.strictEqual(print(ast), '<div class="foo bar baz"></div>');
});

test('-private | glimmer-syntax | AttrNode > quotes are preserved when updating a ConcatStatement value', function () {
  const template = `<div class="lol {{foo}}"></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.parts[0].chars = 'hahah ';

  assert.strictEqual(print(ast), '<div class="hahah {{foo}}"></div>');
});

test('-private | glimmer-syntax | AttrNode > quotes are preserved when updating an AttrNode name - issue #319', function () {
  const template = '<div @class="{{if foo "bar"}} baz" />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].name = 'class';

  assert.strictEqual(print(ast), '<div class="{{if foo "bar"}} baz" />');
});

test('-private | glimmer-syntax | AttrNode > quotes are preserved when updating an AttrNode value - issue #588', function () {
  const template = '<div class="{{if foo "bar"}} baz" />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.concat([builders.text('foobar')]);

  assert.strictEqual(print(ast), '<div class="foobar" />');
});

test('-private | glimmer-syntax | AttrNode > TextNode quote types can be changed', function () {
  let template = '<div class=foo />';
  let ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].quoteType = "'";

  assert.strictEqual(print(ast), "<div class='foo' />");

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].quoteType = '"';

  assert.strictEqual(print(ast), '<div class="foo" />');

  template = '<div class="foo" />';
  ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].quoteType = null;

  assert.strictEqual(print(ast), '<div class=foo />');
});

test('-private | glimmer-syntax | AttrNode > ConcatStatement quote types can be changed', function () {
  let template = '<div class="{{foo}} static {{bar}}" />';
  let ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].quoteType = "'";

  assert.strictEqual(print(ast), "<div class='{{foo}} static {{bar}}' />");

  template = "<div class='{{foo}} static {{bar}}' />";
  ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].quoteType = '"';

  assert.strictEqual(print(ast), '<div class="{{foo}} static {{bar}}" />');
});

test('-private | glimmer-syntax | AttrNode > can create a single-quoted concat value', function () {
  // We usually use the glimmer printer for any user-created nodes.
  // But the glimmer printer hardcodes double-quotes for ConcatStatements.
  // So, if the user specifies single quotes and creates a concat value,
  // make sure it doesn't accidentally use multiple qutoes.
  const template = '<div class="foo" />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].quoteType = "'";
  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.concat([
    builders.mustache('foo'),
    builders.text(' static '),
    builders.mustache('bar'),
  ]);

  assert.strictEqual(print(ast), "<div class='{{foo}} static {{bar}}' />");
});

test('-private | glimmer-syntax | AttrNode > can specify quote style on a new attribute', function () {
  const template = '<div />';
  const ast = parse(template);

  const c = builders.attr('class', builders.text('foo'));
  // @ts-expect-error: Incorrect type
  c.quoteType = null;
  // @ts-expect-error: Incorrect type
  ast.body[0].attributes.push(c);

  assert.strictEqual(print(ast), '<div class=foo />');
});

test('-private | glimmer-syntax | AttrNode > can specify valueless on a new attribute', function () {
  const template = '<div />';
  const ast = parse(template);

  const c = builders.attr('...attributes', builders.text(''));
  // @ts-expect-error: Incorrect type
  c.isValueless = true;
  // @ts-expect-error: Incorrect type
  ast.body[0].attributes.push(c);

  assert.strictEqual(print(ast), '<div ...attributes />');
});

test('-private | glimmer-syntax | AttrNode > invalid quote types are rejected', function () {
  const template = '<div class="foo" />';
  let ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].quoteType = '"';
  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.mustache('foo');

  assert.throws(() => {
    print(ast);
  }, 'should not be quoted');

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].quoteType = "'";

  assert.throws(() => {
    print(ast);
  }, 'should not be quoted');

  ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].quoteType = null;
  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.concat([
    builders.mustache('foo'),
    builders.text(' static'),
  ]);

  assert.throws(() => {
    print(ast);
  }, 'must be quoted');

  ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].quoteType = null;
  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.text('foo bar');

  assert.throws(() => {
    print(ast);
  }, '`foo bar` is invalid as an unquoted attribute');
});
