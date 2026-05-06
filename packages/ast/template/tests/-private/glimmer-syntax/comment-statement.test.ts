import { assert, test } from '@codemod-utils/tests';

import { parse, print } from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | CommentStatement > can be updated', function () {
  const template = `<!-- something -->`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].value = ' otherthing ';

  assert.strictEqual(print(ast), `<!-- otherthing -->`);
});
