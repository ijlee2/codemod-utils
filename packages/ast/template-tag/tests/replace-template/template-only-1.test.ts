import { assert, test } from '@codemod-utils/tests';

import { replaceTemplate } from '../../src/index.js';

test('replace-template > template-only (1)', function () {
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

  const newFile = replaceTemplate(oldFile, {
    range: {
      endByte: 119,
      endChar: 119,
      startByte: 36,
      startChar: 36,
    },
    template: '\n  New contents\n',
  });

  assert.strictEqual(
    newFile,
    [
      `import styles from './styles.css';`,
      ``,
      `<template>`,
      `  New contents`,
      `</template>;`,
      ``,
    ].join('\n'),
  );
});
