/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { EOL } from 'node:os';

import { assert, normalizeFile, test } from '@codemod-utils/tests';
import type { AST } from '@glimmer/syntax';

import {
  builders,
  parse,
  print,
} from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | ElementNode > creating void element', function () {
  const template = ``;
  const ast = parse(template);

  // in @glimmer/syntax v0.82.0,
  // builders.element requires an empty object as a second arg
  ast.body.push(builders.element('img', {}));

  assert.strictEqual(print(ast), `<img>`);
});

test('-private | glimmer-syntax | ElementNode > updating attributes on a non-self-closing void element', function () {
  const template = `<img src="{{something}}">`;
  const ast = parse(template);

  const element = ast.body[0] as AST.ElementNode;
  const attribute = element.attributes[0] as AST.AttrNode;
  const concat = attribute.value as AST.ConcatStatement;
  (concat.parts[0] as AST.MustacheStatement).path =
    builders.path('this.something');

  assert.strictEqual(print(ast), `<img src="{{this.something}}">`);
});

test('-private | glimmer-syntax | ElementNode > reusing another template part to build a new template', function () {
  const template = `foo`;
  const original = parse(template);
  const text = original.body[0] as AST.TextNode;
  const ast = builders.template([text]);

  assert.strictEqual(print(ast), `foo`);
});

test('-private | glimmer-syntax | ElementNode > wrapping a parsed node (which uses custom formatting) with a raw node', function () {
  // Ensuring fix for GH#586
  // (infinite recursion when printing custom nodes containing parsed nodes)
  // plays nicely with custom printing from GH#653
  // (specifying quoteType on custom nodes, adds a printing override)
  const template = `<Foo @class='a {{b}} c' />`;
  const original = parse(template);

  const raw_wrapping_ast = builders.template([
    builders.element('div', {
      children: original.body,
    }),
  ]);

  assert.strictEqual(
    print(raw_wrapping_ast),
    `<div><Foo @class='a {{b}} c' /></div>`,
  );
});

test('-private | glimmer-syntax | ElementNode > changing an element to a void element does not print closing tag', function () {
  const template = `<div data-foo="{{something}}"></div>`;
  const ast = parse(template);

  const element = ast.body[0] as AST.ElementNode;
  element.tag = 'img';

  assert.strictEqual(print(ast), `<img data-foo="{{something}}">`);
});

test('-private | glimmer-syntax | ElementNode > updating attributes on a self-closing void element', function () {
  const template = `<img src="{{something}}" />`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value.parts[0].path =
    builders.path('this.something');

  assert.strictEqual(print(ast), `<img src="{{this.something}}" />`);
});

test('-private | glimmer-syntax | ElementNode > changing an attribute value from mustache to text node (GH#111)', function () {
  const template = `<FooBar @thing={{1234}} @baz={{derp}} />`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.text('static thing 1');
  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[1].value = builders.text('static thing 2');

  assert.strictEqual(
    print(ast),
    `<FooBar @thing="static thing 1" @baz="static thing 2" />`,
  );
});

test('-private | glimmer-syntax | ElementNode > changing an attribute value from text node to mustache (GH #139)', function () {
  const template = `<FooBar @foo="Hi, I'm a string!" />`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.mustache('my-awesome-helper', [
    builders.string('hello'),
    builders.string('world'),
  ]);

  assert.strictEqual(
    print(ast),
    `<FooBar @foo={{my-awesome-helper "hello" "world"}} />`,
  );
});

test('-private | glimmer-syntax | ElementNode > changing an attribute value from text node to concat statement (GH #139)', function () {
  const template = `<FooBar @foo="Hi, I'm a string!" />`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.concat([
    builders.text('Hello '),
    builders.mustache('my-awesome-helper', [
      builders.string('hello'),
      builders.string('world'),
    ]),
    builders.text(' world'),
  ]);

  assert.strictEqual(
    print(ast),
    `<FooBar @foo="Hello {{my-awesome-helper "hello" "world"}} world" />`,
  );
});

test('-private | glimmer-syntax | ElementNode > changing an attribute value from mustache to mustache', function () {
  const template = `<FooBar @foo={{12345}} />`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].value = builders.mustache('my-awesome-helper', [
    builders.string('hello'),
    builders.string('world'),
  ]);

  assert.strictEqual(
    print(ast),
    `<FooBar @foo={{my-awesome-helper "hello" "world"}} />`,
  );
});

test('-private | glimmer-syntax | ElementNode > rename element tagname', function () {
  const template = normalizeFile([
    `<div data-foo='single quoted'>`,
    `  </div>`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].tag = 'a';

  assert.strictEqual(
    print(ast),
    normalizeFile([`<a data-foo='single quoted'>`, `  </a>`]),
  );
});

test('-private | glimmer-syntax | ElementNode > rename element tagname without children', function () {
  const template = `<div></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].tag = 'a';

  assert.strictEqual(print(ast), `<a></a>`);
});

test('-private | glimmer-syntax | ElementNode > rename self-closing element tagname', function () {
  const ast = parse('<Foo bar="baz"/>');

  // @ts-expect-error: Incorrect type
  ast.body[0].tag = 'Qux';

  assert.strictEqual(print(ast), '<Qux bar="baz"/>');
});

test('-private | glimmer-syntax | ElementNode > rename self-closing element tagname with trailing whitespace', function () {
  const ast = parse('<Foo />');

  // @ts-expect-error: Incorrect type
  ast.body[0].tag = 'Qux';

  assert.strictEqual(print(ast), '<Qux />');
});

test('-private | glimmer-syntax | ElementNode > Rename tag and convert from self-closing with attributes to block element', function () {
  const ast = parse('<Foo bar="baz" />');

  // @ts-expect-error: Incorrect type
  ast.body[0].tag = 'Qux';
  // @ts-expect-error: Incorrect type
  ast.body[0].children = [builders.text('bay')];

  assert.strictEqual(print(ast), '<Qux bar="baz">bay</Qux>');
});

test('-private | glimmer-syntax | ElementNode > convert from self-closing with attributes to block element', function () {
  const ast = parse('<Foo bar="baz" />');

  // @ts-expect-error: Incorrect type
  ast.body[0].children = [builders.text('bay')];

  assert.strictEqual(print(ast), '<Foo bar="baz">bay</Foo>');
});

test('-private | glimmer-syntax | ElementNode > convert from self-closing with specially spaced attributes to block element', function () {
  const ast = parse(normalizeFile([`<Foo`, `  bar="baz"`, ` />`]));

  // @ts-expect-error: Incorrect type
  ast.body[0].children = [builders.text('bay')];

  assert.strictEqual(
    print(ast),
    normalizeFile([`<Foo`, `  bar="baz"`, ` >bay</Foo>`]),
  );
});

test('-private | glimmer-syntax | ElementNode > Convert self-closing element with modifiers block element', function () {
  const ast = parse('<Foo {{on "click" this.doSomething}} />');

  // @ts-expect-error: Incorrect type
  ast.body[0].children = [builders.text('bay')];

  assert.strictEqual(
    print(ast),
    '<Foo {{on "click" this.doSomething}}>bay</Foo>',
  );
});

test('-private | glimmer-syntax | ElementNode > adding attribute when none originally existed', function () {
  const template = `<div></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes.push(
    builders.attr('data-test', builders.text('wheee')),
  );

  assert.strictEqual(print(ast), `<div data-test="wheee"></div>`);
});

test('-private | glimmer-syntax | ElementNode > adding attribute to ElementNode with block params', function () {
  const template = `<Foo as |bar|></Foo>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes.push(
    builders.attr('data-test', builders.text('wheee')),
  );

  assert.strictEqual(print(ast), `<Foo data-test="wheee" as |bar|></Foo>`);
});

test('-private | glimmer-syntax | ElementNode > adding attribute to ElementNode with block params (extra whitespace)', function () {
  const template = normalizeFile([`<Foo as |`, `bar`, `  |></Foo>`]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes.push(
    builders.attr('data-test', builders.text('wheee')),
  );

  assert.strictEqual(
    print(ast),
    normalizeFile([`<Foo data-test="wheee" as |`, `bar`, `  |></Foo>`]),
  );
});

test('-private | glimmer-syntax | ElementNode > adding boolean attribute to ElementNode', function () {
  const template = `<button></button>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes.push(
    builders.attr('disabled', builders.mustache(builders.boolean(true))),
  );

  assert.strictEqual(print(ast), '<button disabled={{true}}></button>');
});

test('-private | glimmer-syntax | ElementNode > adding an attribute to existing list', function () {
  const template = normalizeFile([
    `<div`,
    `  data-foo='lol'`,
    `  data-bar=hahaha`,
    `></div>`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes.push(
    builders.attr('data-test', builders.text('wheee')),
  );

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `<div`,
      `  data-foo='lol'`,
      `  data-bar=hahaha data-test="wheee"`,
      `></div>`,
    ]),
  );
});

test('-private | glimmer-syntax | ElementNode > creating an element with complex attributes', function () {
  const template = '';
  const ast = parse(template);

  ast.body.push(
    builders.element(
      { name: 'FooBar', selfClosing: true },
      {
        attrs: [
          builders.attr(
            '@thing',
            builders.mustache(
              builders.path('hash'),
              [],
              builders.hash([builders.pair('something', builders.path('bar'))]),
            ),
          ),
        ],
      },
    ),
  );

  assert.strictEqual(print(ast), `<FooBar @thing={{hash something=bar}} />`);
});

test('-private | glimmer-syntax | ElementNode > modifying an attribute name (GH#112)', function () {
  const template = normalizeFile([
    `<div`,
    `  data-foo='some thing here'`,
    `  data-bar=hahaha`,
    `></div>`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[0].name = 'data-test';

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `<div`,
      `  data-test='some thing here'`,
      `  data-bar=hahaha`,
      `></div>`,
    ]),
  );
});

test('-private | glimmer-syntax | ElementNode > modifying attribute after valueless attribute', function () {
  const template = '<Foo data-foo data-derp={{hmmm}} />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[1].value.path = builders.path('this.hmmm');

  assert.strictEqual(print(ast), '<Foo data-foo data-derp={{this.hmmm}} />');
});

test('-private | glimmer-syntax | ElementNode > modifying attribute after valueless attribute with special whitespace', function () {
  const template = normalizeFile([
    `<Foo`,
    `  data-foo`,
    `  data-derp={{hmmm}}`,
    `/>`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes[1].value.path = builders.path('this.hmmm');

  assert.strictEqual(
    print(ast),
    normalizeFile([`<Foo`, `  data-foo`, `  data-derp={{this.hmmm}}`, `/>`]),
  );
});

test('-private | glimmer-syntax | ElementNode > adding attribute after valueless attribute', function () {
  const template = '<Foo data-foo />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes.push(builders.attr('data-bar', builders.text('foo')));

  assert.strictEqual(print(ast), '<Foo data-foo data-bar="foo" />');
});

test('-private | glimmer-syntax | ElementNode > adding valueless attribute when no open parts existed', function () {
  const template = '<Foo />';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].attributes.push(builders.attr('data-bar', builders.text('')));

  assert.strictEqual(print(ast), '<Foo data-bar />');
});

test('-private | glimmer-syntax | ElementNode > adding modifier when no open parts originally existed', function () {
  const template = `<div></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].modifiers.push(
    builders.elementModifier('on', [
      builders.string('click'),
      builders.path('this.foo'),
    ]),
  );

  assert.strictEqual(print(ast), `<div {{on "click" this.foo}}></div>`);
});

test('-private | glimmer-syntax | ElementNode > adding modifier with existing attributes', function () {
  const template = `<div class="foo"></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].modifiers.push(
    builders.elementModifier('on', [
      builders.string('click'),
      builders.path('this.foo'),
    ]),
  );

  assert.strictEqual(
    print(ast),
    `<div class="foo" {{on "click" this.foo}}></div>`,
  );
});

// This is specifically testing the issue described in https://github.com/glimmerjs/glimmer-vm/pull/953
test('-private | glimmer-syntax | ElementNode > adding modifier when ...attributes is present', function () {
  const template = `<div data-foo="asdf" data-foo data-other="asdf"></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].modifiers.push(
    builders.elementModifier('on', [
      builders.string('click'),
      builders.path('this.foo'),
    ]),
  );

  assert.strictEqual(
    print(ast),
    `<div data-foo="asdf" data-foo data-other="asdf" {{on "click" this.foo}}></div>`,
  );
});

test('-private | glimmer-syntax | ElementNode > removing a modifier with other attributes', function () {
  const template = `<div class="foo" {{on "click" this.blah}}></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].modifiers.shift();

  assert.strictEqual(print(ast), `<div class="foo"></div>`);
});

test('-private | glimmer-syntax | ElementNode > removing a modifier with no other attributes/comments/modifiers', function () {
  const template = `<div {{on "click" this.blah}}></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].modifiers.shift();

  assert.strictEqual(print(ast), `<div></div>`);
});

test('-private | glimmer-syntax | ElementNode > adding comment when no open parts originally existed', function () {
  const template = `<div></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].comments.push(
    builders.mustacheComment(' template-lint-disable '),
  );

  assert.strictEqual(
    print(ast),
    `<div {{!-- template-lint-disable --}}></div>`,
  );
});

test('-private | glimmer-syntax | ElementNode > adding comment with existing attributes', function () {
  const template = `<div class="foo"></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].comments.push(
    builders.mustacheComment(' template-lint-disable '),
  );

  assert.strictEqual(
    print(ast),
    `<div class="foo" {{!-- template-lint-disable --}}></div>`,
  );
});

test('-private | glimmer-syntax | ElementNode > adding block param', function () {
  const template = `<MyFoo class="foo"></MyFoo>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  const blockParams = ast.body[0].blockParams;
  blockParams.push('blah');
  // @ts-expect-error: Incorrect type
  ast.body[0].blockParams = blockParams;

  assert.strictEqual(print(ast), `<MyFoo class="foo" as |blah|></MyFoo>`);
});

test('-private | glimmer-syntax | ElementNode > removing a block param', function () {
  const template = `<MyFoo class="foo" as |bar|></MyFoo>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  const blockParams = ast.body[0].blockParams;
  blockParams.pop();
  // @ts-expect-error: Incorrect type
  ast.body[0].blockParams = blockParams;

  assert.strictEqual(print(ast), `<MyFoo class="foo"></MyFoo>`);
});

test('-private | glimmer-syntax | ElementNode > removing a block param preserves formatting of "open element closing"', function () {
  const template = normalizeFile([
    `<MyFoo`,
    `  class="foo"`,
    `  as |bar|`,
    `></MyFoo>`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  const blockParams = ast.body[0].blockParams;
  blockParams.pop();
  // @ts-expect-error: Incorrect type
  ast.body[0].blockParams = blockParams;

  assert.strictEqual(
    print(ast),
    normalizeFile([`<MyFoo`, `  class="foo"`, `></MyFoo>`]),
  );
});

test('-private | glimmer-syntax | ElementNode > interleaved attributes and modifiers are not modified when unchanged', function () {
  const template = `<div data-test="foo" {{on "click" this.bar}} data-blah="derp"></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].comments.push(
    builders.mustacheComment(' template-lint-disable '),
  );

  assert.strictEqual(
    print(ast),
    `<div data-test="foo" {{on "click" this.bar}} data-blah="derp" {{!-- template-lint-disable --}}></div>`,
  );
});

test('-private | glimmer-syntax | ElementNode > adding children to element with children', function () {
  const template = normalizeFile([`<ul>`, `  <li></li>`, `</ul>`]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].children.splice(
    2,
    0,
    builders.text(`${EOL}  `),
    builders.element('li', {
      attrs: [builders.attr('data-foo', builders.text('bar'))],
    }),
  );

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `<ul>`,
      `  <li></li>`,
      `  <li data-foo="bar"></li>`,
      `</ul>`,
    ]),
  );
});

test('-private | glimmer-syntax | ElementNode > adding children to an empty element', function () {
  const template = `<div></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].children.push(builders.text('some text'));

  assert.strictEqual(print(ast), '<div>some text</div>');
});

test('-private | glimmer-syntax | ElementNode > adding children to a self closing element', function () {
  const template = `<Foo />`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].children.push(builders.text('some text'));

  assert.strictEqual(print(ast), '<Foo>some text</Foo>');
});

test('-private | glimmer-syntax | ElementNode > moving a child to another ElementNode', function () {
  const template = normalizeFile([
    `<Foo>{{`,
    `  special-formatting-here`,
    `}}</Foo>`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  const child = ast.body[0].children.pop();
  ast.body.unshift(builders.text(EOL));
  ast.body.unshift(child);

  assert.strictEqual(
    print(ast),
    normalizeFile([`{{`, `  special-formatting-here`, `}}`, `<Foo></Foo>`]),
  );
});

test('-private | glimmer-syntax | ElementNode > adding a new attribute to an ElementNode while preserving the existing whitespaces', function () {
  const template = normalizeFile([
    `<div data-foo`,
    ` data-bar="lol"`,
    `      some-other-thing={{haha}}>`,
    `</div>`,
  ]);
  const ast = parse(template);

  const element = ast.body[0] as AST.ElementNode;
  element.attributes.push(builders.attr('foo-foo', builders.text('wheee')));

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `<div data-foo`,
      ` data-bar="lol"`,
      `      some-other-thing={{haha}} foo-foo="wheee">`,
      `</div>`,
    ]),
  );
});

test('-private | glimmer-syntax | ElementNode > issue 706', function () {
  const template = normalizeFile([
    `<div`,
    `  class="pt-2 pb-4 {{this.foo}}"`,
    `>`,
    `  {{#each this.data as |chunks|}}`,
    `    {{#each chunks as |chunk|}}`,
    `      {{#if (this.shouldShowImage chunk)}}`,
    `        <p class="px-4">foo</p>`,
    `      {{else}}`,
    `        <p>bar</p>`,
    `      {{/if}}`,
    `    {{/each}}`,
    `  {{/each}}`,
    `</div>`,
  ]);
  const ast = parse(template);

  const block1 = (ast.body[0] as AST.ElementNode)
    .children[1] as AST.BlockStatement;
  const block2 = block1.program.body[1] as AST.BlockStatement;
  const block3 = block2.program.body[1] as AST.BlockStatement;
  const element = block3.program.body[1] as AST.ElementNode;
  const attribute = element.attributes[0] as AST.AttrNode;
  (attribute.value as AST.TextNode).chars = 'foo';

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `<div`,
      `  class="pt-2 pb-4 {{this.foo}}"`,
      `>`,
      `  {{#each this.data as |chunks|}}`,
      `    {{#each chunks as |chunk|}}`,
      `      {{#if (this.shouldShowImage chunk)}}`,
      `        <p class="foo">foo</p>`,
      `      {{else}}`,
      `        <p>bar</p>`,
      `      {{/if}}`,
      `    {{/each}}`,
      `  {{/each}}`,
      `</div>`,
    ]),
  );
});
