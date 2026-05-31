import { assert, test } from '@codemod-utils/tests';

import { parseVersion } from '../../src/index.js';

test('parse-version > error handling (workspace syntax)', function () {
  assert.strictEqual(parseVersion('workspace:^'), undefined);

  assert.strictEqual(parseVersion('workspace:~'), undefined);

  assert.strictEqual(parseVersion('workspace:*'), undefined);
});
