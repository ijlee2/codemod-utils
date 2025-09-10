import { assert, test } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';

test('replace-template-tag > template-only (2)', function () {
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

  const newFile = replaceTemplateTag(oldFile, {
    code: '<template>\n  New contents\n</template>',
    range: {
      endByte: 119,
      endChar: 119,
      startByte: 36,
      startChar: 36,
    },
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
