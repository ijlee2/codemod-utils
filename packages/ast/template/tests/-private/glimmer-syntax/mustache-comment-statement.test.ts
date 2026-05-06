/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert, test } from '@codemod-utils/tests';

import { parse, print } from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | MustacheCommentStatement > can be updated', function () {
  const template = `<div {{!-- something here --}}></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].comments[0].value = ' otherthing ';

  assert.strictEqual(print(ast), `<div {{!-- otherthing --}}></div>`);
});

test('-private | glimmer-syntax | MustacheCommentStatement > comments without `--` are preserved', function () {
  const template = `<div {{! something here }}></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].comments[0].value = ' otherthing ';

  assert.strictEqual(print(ast), `<div {{! otherthing }}></div>`);
});
