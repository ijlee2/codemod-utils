import { assert, test } from '@codemod-utils/tests';
import { EOL } from 'node:os';

export function testForPosix(testFn: typeof test): void {
  if (EOL === '\r\n') {
    assert.ok(true);
    return;
  }

  testFn();
}
