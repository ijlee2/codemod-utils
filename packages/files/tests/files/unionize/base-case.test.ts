import { assert, test } from '@codemod-utils/tests';

import { unionize } from '../../../src/index.js';

test('files | unionize > base case', function () {
  const pattern = unionize([
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
  ]);

  assert.strictEqual(pattern, '{package-lock.json,pnpm-lock.yaml,yarn.lock}');
});
