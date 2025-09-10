import { assert, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > template-only (2)', function () {
  const oldFile = [
    `import styles from './styles.css';`,
    ``,
    `<template>`,
    `  <div class={{styles.container}}>`,
    `    Hello world!`,
    `  </div>`,
    `</template>;`,
    ``,
  ].join('\n');

  const newFile = toEcma(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import styles from './styles.css';`,
      ``,
      `\``,
      `  <div class={{styles.container}}>`,
      `    Hello world!`,
      `  </div>`,
      `                   \`;`,
      ``,
    ].join('\n'),
  );
});
