/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { assert, normalizeFile, test } from '@codemod-utils/tests';
import type { AST } from '@glimmer/syntax';

import {
  builders,
  parse,
  print,
} from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | MustacheStatement > path mutations retain custom whitespace formatting', function () {
  const template = `{{ foo }}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].path.original = 'bar';

  assert.strictEqual(print(ast), '{{ bar }}');
});

test('-private | glimmer-syntax | MustacheStatement > updating from this.foo to @foo via path.original mutation', function () {
  const template = `{{this.foo}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].path.original = '@foo';

  assert.strictEqual(print(ast), '{{@foo}}');
});

test('-private | glimmer-syntax | MustacheStatement > updating from this.foo to @foo via path replacement', function () {
  const template = `{{this.foo}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].path = builders.path('@foo');

  assert.strictEqual(print(ast), '{{@foo}}');
});

test('-private | glimmer-syntax | MustacheStatement > updating path via path replacement retains custom whitespace', function () {
  const template = normalizeFile([`{{`, `@foo`, `}}`]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].path = builders.path('this.foo');

  assert.strictEqual(print(ast), normalizeFile([`{{`, `this.foo`, `}}`]));
});

test('-private | glimmer-syntax | MustacheStatement > rename non-block component', function () {
  const template = normalizeFile([
    `{{foo-bar`,
    `  baz="stuff"`,
    `  other='single quote'`,
    `}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].path = builders.path('baz-derp');

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `{{baz-derp`,
      `  baz="stuff"`,
      `  other='single quote'`,
      `}}`,
    ]),
  );
});

test('-private | glimmer-syntax | MustacheStatement > can add param', function () {
  const template = normalizeFile([
    `{{foo-bar`,
    `  baz=(stuff`,
    `    goes='here')`,
    `}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].params.push(builders.path('zomg'));

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `{{foo-bar`,
      `  zomg`,
      `  baz=(stuff`,
      `    goes='here')`,
      `}}`,
    ]),
  );
});

test('-private | glimmer-syntax | MustacheStatement > can remove param', function () {
  const template = normalizeFile([
    `{{foo-bar`,
    `  hhaahahaha`,
    `  baz=(stuff`,
    `    goes='here')`,
    `}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].params.pop();

  assert.strictEqual(
    print(ast),
    normalizeFile([`{{foo-bar`, `  baz=(stuff`, `    goes='here')`, `}}`]),
  );
});

test('-private | glimmer-syntax | MustacheStatement > replacing empty hash pair on MustacheStatement works', function () {
  const template = '{{foo-bar}}';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash = builders.hash([
    builders.pair('hello', builders.string('world')),
  ]);

  assert.strictEqual(print(ast), `{{foo-bar hello="world"}}`);
});

test('-private | glimmer-syntax | MustacheStatement > infers indentation of hash when multiple HashPairs existed', function () {
  const template = normalizeFile([
    `{{foo-bar`,
    `  baz="stuff"`,
    `  other='single quote'`,
    `}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(
    builders.pair('some', builders.string('other-thing')),
  );

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `{{foo-bar`,
      `  baz="stuff"`,
      `  other='single quote'`,
      `  some="other-thing"`,
      `}}`,
    ]),
  );
});

test('-private | glimmer-syntax | MustacheStatement > infers indentation of hash when no existing hash existed but params do', function () {
  const template = normalizeFile([`{{foo-bar`, `  someParam`, `}}`]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(
    builders.pair('some', builders.string('other-thing')),
  );

  assert.strictEqual(
    print(ast),
    normalizeFile([`{{foo-bar`, `  someParam`, `  some="other-thing"`, `}}`]),
  );
});

test('-private | glimmer-syntax | MustacheStatement > infers indentation of new HashPairs when existing hash with single entry (but no params)', function () {
  const template = normalizeFile([`{{foo-bar`, `  stuff=here`, `}}`]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(
    builders.pair('some', builders.string('other-thing')),
  );

  assert.strictEqual(
    print(ast),
    normalizeFile([`{{foo-bar`, `  stuff=here`, `  some="other-thing"`, `}}`]),
  );
});

test('-private | glimmer-syntax | MustacheStatement > can add literal hash pair values', function () {
  const template = normalizeFile([`{{foo-bar`, `  first=thing`, `}}`]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(builders.pair('some', builders.null()));
  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(builders.pair('other', builders.undefined()));
  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(builders.pair('things', builders.boolean(true)));
  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(builders.pair('go', builders.number(42)));
  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(builders.pair('here', builders.boolean(false)));

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `{{foo-bar`,
      `  first=thing`,
      `  some=null`,
      `  other=undefined`,
      `  things=true`,
      `  go=42`,
      `  here=false`,
      `}}`,
    ]),
  );
});

test('-private | glimmer-syntax | MustacheStatement > creating new MustacheStatement with single param has correct whitespace', function () {
  const ast = parse('');

  ast.body.push(builders.mustache('foo', [builders.string('hi')]));

  assert.strictEqual(print(ast), `{{foo "hi"}}`);
});

test('-private | glimmer-syntax | MustacheStatement > copying params and hash from a sub expression into a new MustacheStatement has correct whitespace', function () {
  const ast = parse('{{some-helper (foo "hi")}}');

  const mustache = ast.body[0] as AST.MustacheStatement;
  const sexpr = mustache.params[0] as AST.SubExpression;
  ast.body.push(builders.mustache(sexpr.path, sexpr.params, sexpr.hash));

  assert.strictEqual(print(ast), `{{some-helper (foo "hi")}}{{foo "hi"}}`);
});
