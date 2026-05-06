/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { assert, normalizeFile, test } from '@codemod-utils/tests';

import {
  builders,
  parse,
  print,
} from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | BlockStatement > rename block component', function () {
  const template = normalizeFile([
    `{{#foo-bar`,
    `  baz="stuff"`,
    `}}`,
    `  <div data-foo='single quoted'>`,
    `    </div>`,
    `{{/foo-bar}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].path = builders.path('baz-derp');

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `{{#baz-derp`,
      `  baz="stuff"`,
      `}}`,
      `  <div data-foo='single quoted'>`,
      `    </div>`,
      `{{/baz-derp}}`,
    ]),
  );
});

test('-private | glimmer-syntax | BlockStatement > rename block component from longer to shorter name', function () {
  const template = normalizeFile([
    `{{#this-is-a-long-name`,
    `  hello="world"`,
    `}}`,
    `  <div data-foo='single quoted'>`,
    `    </div>`,
    `{{/this-is-a-long-name}}{{someInlineComponent hello="world"}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].path = builders.path('baz-derp');

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `{{#baz-derp`,
      `  hello="world"`,
      `}}`,
      `  <div data-foo='single quoted'>`,
      `    </div>`,
      `{{/baz-derp}}{{someInlineComponent hello="world"}}`,
    ]),
  );
});

test('-private | glimmer-syntax | BlockStatement > replacing a previously empty hash', function () {
  const template = `{{#foo-bar}}Hi there!{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash = builders.hash([
    builders.pair('hello', builders.string('world')),
  ]);

  assert.strictEqual(
    print(ast),
    '{{#foo-bar hello="world"}}Hi there!{{/foo-bar}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > adding multiple HashPair to previously empty hash', function () {
  const template = '{{#foo-bar}}Hi there!{{/foo-bar}}{{baz}}';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(builders.pair('hello', builders.string('world')));
  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(builders.pair('foo', builders.string('bar')));

  assert.strictEqual(
    print(ast),
    '{{#foo-bar hello="world" foo="bar"}}Hi there!{{/foo-bar}}{{baz}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > replacing empty hash w/ block params works', function () {
  const template = `{{#foo-bar as |a b c|}}Hi there!{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash = builders.hash([
    builders.pair('hello', builders.string('world')),
  ]);

  assert.strictEqual(
    print(ast),
    '{{#foo-bar hello="world" as |a b c|}}Hi there!{{/foo-bar}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > adding new HashPair to an empty hash w/ block params works', function () {
  const template = `{{#foo-bar as |a b c|}}Hi there!{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs.push(builders.pair('hello', builders.string('world')));

  assert.strictEqual(
    print(ast),
    '{{#foo-bar hello="world" as |a b c|}}Hi there!{{/foo-bar}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > changing a HashPair key with a StringLiteral value (GH#112)', function () {
  const template = `{{#foo-bar foo="some thing with a space"}}Hi there!{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].key = 'bar';

  assert.strictEqual(
    print(ast),
    '{{#foo-bar bar="some thing with a space"}}Hi there!{{/foo-bar}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > changing a HashPair key with a SubExpression value (GH#112)', function () {
  const template = `{{#foo-bar foo=(helper-here this.arg1 this.arg2)}}Hi there!{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].key = 'bar';

  assert.strictEqual(
    print(ast),
    '{{#foo-bar bar=(helper-here this.arg1 this.arg2)}}Hi there!{{/foo-bar}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > changing a HashPair value from StringLiteral to SubExpression', function () {
  const template = `{{#foo-bar foo="bar!"}}Hi there!{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].value = builders.sexpr('concat', [
    builders.string('hello'),
    builders.string('world'),
  ]);

  assert.strictEqual(
    print(ast),
    '{{#foo-bar foo=(concat "hello" "world")}}Hi there!{{/foo-bar}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > changing a HashPair value from SubExpression to StringLiteral', function () {
  const template = `{{#foo-bar foo=(concat "hello" "world")}}Hi there!{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].hash.pairs[0].value = builders.string('hello world!');

  assert.strictEqual(
    print(ast),
    '{{#foo-bar foo="hello world!"}}Hi there!{{/foo-bar}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > adding param with no params or hash', function () {
  const template = `{{#foo-bar}}Hi there!{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].params.push(builders.path('this.foo'));

  assert.strictEqual(print(ast), '{{#foo-bar this.foo}}Hi there!{{/foo-bar}}');
});

test('-private | glimmer-syntax | BlockStatement > adding param with empty program', function () {
  const template = `{{#foo-bar}}{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].params.push(builders.path('this.foo'));

  assert.strictEqual(print(ast), '{{#foo-bar this.foo}}{{/foo-bar}}');
});

test('-private | glimmer-syntax | BlockStatement > adding param with existing params', function () {
  const template = `{{#foo-bar this.first}}Hi there!{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].params.push(builders.path('this.foo'));

  assert.strictEqual(
    print(ast),
    '{{#foo-bar this.first this.foo}}Hi there!{{/foo-bar}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > adding param with existing params infers indentation from existing params', function () {
  const template = normalizeFile([
    `{{#foo-bar `,
    `   `,
    `this.first}}Hi there!{{/foo-bar}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].params.push(builders.path('this.foo'));

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `{{#foo-bar `,
      `   `,
      `this.first `,
      `   `,
      `this.foo}}Hi there!{{/foo-bar}}`,
    ]),
  );
});

test('-private | glimmer-syntax | BlockStatement > adding child to end of program', function () {
  const template = `{{#foo-bar}}Hello{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].program.body.push(builders.text(' world!'));

  assert.strictEqual(print(ast), '{{#foo-bar}}Hello world!{{/foo-bar}}');
});

test('-private | glimmer-syntax | BlockStatement > adding child to beginning of program', function () {
  const template = `{{#foo-bar}}Hello{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].program.body.unshift(builders.text('ZOMG! '));

  assert.strictEqual(print(ast), '{{#foo-bar}}ZOMG! Hello{{/foo-bar}}');
});

test('-private | glimmer-syntax | BlockStatement > adding child to end of inverse', function () {
  const template = `{{#foo-bar}}{{else}}Hello{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].inverse.body.push(builders.text(' world!'));

  assert.strictEqual(
    print(ast),
    '{{#foo-bar}}{{else}}Hello world!{{/foo-bar}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > adding child to beginning of inverse', function () {
  const template = `{{#foo-bar}}{{else}}Hello{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].inverse.body.unshift(builders.text('ZOMG! '));

  assert.strictEqual(print(ast), '{{#foo-bar}}{{else}}ZOMG! Hello{{/foo-bar}}');
});

test('-private | glimmer-syntax | BlockStatement > adding child to end of inverse preserves whitespace and whitespace control when program is also present', function () {
  const template = normalizeFile([
    `{{#foo-bar}}Goodbye`,
    `  {{~ else ~}} Hello{{/foo-bar}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].inverse.body.push(builders.text(' world!'));

  assert.strictEqual(
    print(ast),
    normalizeFile([
      `{{#foo-bar}}Goodbye`,
      `  {{~ else ~}} Hello world!{{/foo-bar}}`,
    ]),
  );
});

test('-private | glimmer-syntax | BlockStatement > adding child to end of inverse preserves whitespace and whitespace control', function () {
  const template = `{{#foo-bar}}{{~ else ~}}Hello{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].inverse.body.push(builders.text(' world!'));

  assert.strictEqual(
    print(ast),
    '{{#foo-bar}}{{~ else ~}}Hello world!{{/foo-bar}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > add child in an {{else if foo}} chain', function () {
  const template = `{{#if foo}}{{else if baz}}Hello{{/if}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].inverse.body[0].program.body.push(builders.text(' world!'));

  assert.strictEqual(
    print(ast),
    '{{#if foo}}{{else if baz}}Hello world!{{/if}}',
  );
});

test('-private | glimmer-syntax | BlockStatement > adding an inverse', function () {
  const template = `{{#foo-bar}}{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].inverse = builders.blockItself([builders.text('ZOMG!')]);

  assert.strictEqual(print(ast), '{{#foo-bar}}{{else}}ZOMG!{{/foo-bar}}');
});

test('-private | glimmer-syntax | BlockStatement > removing an inverse', function () {
  const template = `{{#foo-bar}}Goodbye{{else}}Hello{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].inverse = null;

  assert.strictEqual(print(ast), '{{#foo-bar}}Goodbye{{/foo-bar}}');
});

test('-private | glimmer-syntax | BlockStatement > annotating an "else if" node', function () {
  const template = '{{#if foo}}{{else if bar}}{{else}}{{/if}}';
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].inverse.body[0]._isElseIfBlock = true;

  assert.strictEqual(print(ast), '{{#if foo}}{{else if bar}}{{else}}{{/if}}');
});

test('-private | glimmer-syntax | BlockStatement > add block param (when none existed)', function () {
  const template = `{{#foo-bar}}{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  const blockParams = ast.body[0].program.blockParams;
  blockParams.push('foo');
  // @ts-expect-error: Incorrect type
  ast.body[0].program.blockParams = blockParams;

  assert.strictEqual(print(ast), '{{#foo-bar as |foo|}}{{/foo-bar}}');
});

test('-private | glimmer-syntax | BlockStatement > remove only block param', function () {
  const template = `{{#foo-bar as |a|}}{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  const blockParams = ast.body[0].program.blockParams;
  blockParams.pop();
  // @ts-expect-error: Incorrect type
  ast.body[0].program.blockParams = blockParams;

  assert.strictEqual(print(ast), '{{#foo-bar}}{{/foo-bar}}');
});

test('-private | glimmer-syntax | BlockStatement > remove one block param of many', function () {
  const template = `{{#foo-bar as |a b|}}{{/foo-bar}}`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  const blockParams = ast.body[0].program.blockParams;
  blockParams.pop();
  // @ts-expect-error: Incorrect type
  ast.body[0].program.blockParams = blockParams;

  assert.strictEqual(print(ast), '{{#foo-bar as |a|}}{{/foo-bar}}');
});

test('-private | glimmer-syntax | BlockStatement > remove one block param of many preserves custom whitespace', function () {
  const template = normalizeFile([
    `{{#foo-bar`,
    `  as |a b|`,
    `}}`,
    `{{/foo-bar}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  const blockParams = ast.body[0].program.blockParams;
  blockParams.pop();
  // @ts-expect-error: Incorrect type
  ast.body[0].program.blockParams = blockParams;

  assert.strictEqual(
    print(ast),
    normalizeFile([`{{#foo-bar`, `  as |a|`, `}}`, `{{/foo-bar}}`]),
  );
});

test('-private | glimmer-syntax | BlockStatement > remove only block param preserves custom whitespace', function () {
  const template = normalizeFile([
    `{{#foo-bar`,
    `  some=thing`,
    `  as |a|`,
    `}}`,
    `{{/foo-bar}}`,
  ]);
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  const blockParams = ast.body[0].program.blockParams;
  blockParams.pop();
  // @ts-expect-error: Incorrect type
  ast.body[0].program.blockParams = blockParams;

  assert.strictEqual(
    print(ast),
    normalizeFile([`{{#foo-bar`, `  some=thing`, `}}`, `{{/foo-bar}}`]),
  );
});
