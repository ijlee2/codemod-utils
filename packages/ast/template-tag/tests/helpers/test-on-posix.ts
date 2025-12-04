import { EOL } from 'node:os';

import { test } from '@codemod-utils/tests';

const onPosix = EOL === '\n';

export function testOnPosix(...parameters: Parameters<typeof test>): void {
  if (onPosix) {
    test(...parameters);
  }
}
