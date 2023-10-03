import { assert, test } from '@codemod-utils/tests';

import { unionize } from '../../../src/index.js';

test('files | unionize > edge case (1 file path)', function () {
  const pattern = unionize(['README.md']);

  assert.strictEqual(pattern, 'README.md');
});
