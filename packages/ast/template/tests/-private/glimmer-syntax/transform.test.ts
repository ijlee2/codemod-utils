import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { transform } from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | transform > can remove during traversal by returning `null`', function () {
  const template = normalizeFile([
    `<p>here is some multiline string</p>`,
    `{{ other-stuff }}`,
  ]);

  // @ts-expect-error: Incorrect type
  const { code } = transform(template, () => {
    return {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      ElementNode() {
        return null;
      },
    };
  });

  assert.strictEqual(code, normalizeFile([``, `{{ other-stuff }}`]));
});

test('-private | glimmer-syntax | transform > can replace with many items during traversal by returning an array', function () {
  const template = normalizeFile([
    `<p>here is some multiline string</p>`,
    `{{other-stuff}}`,
  ]);

  const { code } = transform(template, (env) => {
    const { builders: b } = env.syntax;

    return {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      ElementNode() {
        return [b.text('hello '), b.text('world')];
      },
    };
  });

  assert.strictEqual(code, normalizeFile([`hello world`, `{{other-stuff}}`]));
});

test('-private | glimmer-syntax | transform > MustacheStatements retain whitespace when multiline replacements occur', function () {
  const template = normalizeFile([`<p></p>`, `{{ other-stuff }}`]);

  const { code } = transform(template, (env) => {
    const { builders: b } = env.syntax;

    return {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      ElementNode() {
        return [b.text('x'), b.text('y')];
      },
    };
  });

  assert.strictEqual(code, normalizeFile([`xy`, `{{ other-stuff }}`]));
});
