import { assert, test } from '@codemod-utils/tests';

import { getAbsolutePath } from '../../../src/index.js';

test('blueprints | get-absolute-path > base case', function () {
  const __dirname = getAbsolutePath();

  assert.strictEqual(__dirname.endsWith('src/blueprints'), true);
});
