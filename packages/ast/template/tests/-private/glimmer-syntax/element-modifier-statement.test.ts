/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert, test } from '@codemod-utils/tests';

import { parse, print } from '../../../src/-private/glimmer-syntax.js';

test('-private | glimmer-syntax | ElementModifierStatement > can be updated', function () {
  const template = `<div {{thing 'foo'}}></div>`;
  const ast = parse(template);

  // @ts-expect-error: Incorrect type
  ast.body[0].modifiers[0].path.original = 'other';

  assert.strictEqual(print(ast), `<div {{other 'foo'}}></div>`);
});
