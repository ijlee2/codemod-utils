import { assert, normalizeFile } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';
import { testOnPosix } from '../helpers/index.js';

testOnPosix('replace-template-tag > template-only (3)', function () {
  const oldFile = normalizeFile([
    `import styles from './styles.css';`,
    ``,
    `export default <template>`,
    `  <div class={{styles.container}}>`,
    `    Hello world!`,
    `  </div>`,
    `</template>;`,
    ``,
  ]);

  const newFile = replaceTemplateTag(oldFile, {
    code: normalizeFile([`<template>`, `  New contents`, `</template>`]),
    range: {
      endByte: 134,
      endChar: 134,
      startByte: 51,
      startChar: 51,
    },
  });

  assert.strictEqual(
    newFile,
    normalizeFile([
      `import styles from './styles.css';`,
      ``,
      `export default <template>`,
      `  New contents`,
      `</template>;`,
      ``,
    ]),
  );
});
