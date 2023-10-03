import { assert, test } from '@codemod-utils/tests';

import { unionize } from '../../../src/index.js';

test('files | unionize > edge case (no file paths)', function () {
  const pattern = unionize([]);

  assert.strictEqual(pattern, '');
});
