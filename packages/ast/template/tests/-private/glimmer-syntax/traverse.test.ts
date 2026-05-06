import { assert, normalizeFile, test } from '@codemod-utils/tests';
import type { NodeVisitor } from '@glimmer/syntax';

import {
  builders,
  print,
  traverse,
} from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | traverse > can remove during traversal by returning `null`', function () {
  const template = normalizeFile([
    `<p>here is some multiline string</p>`,
    `{{ other-stuff }}`,
  ]);

  const ast = traverse()(template, {
    ElementNode() {
      return null;
    },
  } as NodeVisitor);

  assert.strictEqual(print(ast), normalizeFile([``, `{{ other-stuff }}`]));
});

test('-private | glimmer-syntax | traverse > can replace with many items during traversal by returning an array', function () {
  const template = normalizeFile([
    `<p>here is some multiline string</p>`,
    `{{other-stuff}}`,
  ]);

  const ast = traverse()(template, {
    ElementNode() {
      return [builders.text('hello '), builders.text('world')];
    },
  });

  assert.strictEqual(
    print(ast),
    normalizeFile([`hello world`, `{{other-stuff}}`]),
  );
});

test('-private | glimmer-syntax | traverse > issue can handle angle brackets in modifier argument values', function () {
  const template = normalizeFile([
    `<Select`,
    `  @placeholder={{do-something ">> Some Text Here"}}`,
    `  @options={{this.items}}`,
    `  as |item|`,
    `>`,
    `  {{item.name}}`,
    `</Select>`,
  ]);

  const ast = traverse()(template, {
    ElementNode(node) {
      node.tag = `${node.tag}`;
    },
  });

  assert.strictEqual(print(ast), template);
});

test('-private | glimmer-syntax | traverse > MustacheStatements retain whitespace when multiline replacements occur', function () {
  const template = normalizeFile([`<p></p>`, `{{ other-stuff }}`]);

  const ast = traverse()(template, {
    ElementNode() {
      return [builders.text('x'), builders.text('y')];
    },
  });

  assert.strictEqual(print(ast), normalizeFile([`xy`, `{{ other-stuff }}`]));
});
