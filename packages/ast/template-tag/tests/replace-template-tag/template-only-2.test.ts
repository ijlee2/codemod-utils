import { assert, createFile, test } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';

test('replace-template-tag > template-only (2)', function () {
  const oldFile = createFile([
    `import styles from './styles.css';`,
    ``,
    `<template>`,
    `  <div class={{styles.container}}>`,
    `    Hello world!`,
    `  </div>`,
    `</template>;`,
    ``,
  ]);

  const newFile = replaceTemplateTag(oldFile, {
    code: createFile([`<template>`, `  New contents`, `</template>`]),
    range: {
      endByte: 119,
      endChar: 119,
      startByte: 36,
      startChar: 36,
    },
  });

  assert.strictEqual(
    newFile,
    createFile([
      `import styles from './styles.css';`,
      ``,
      `<template>`,
      `  New contents`,
      `</template>;`,
      ``,
    ]),
  );
});
