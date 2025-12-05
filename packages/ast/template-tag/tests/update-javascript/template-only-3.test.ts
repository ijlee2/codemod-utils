import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { data, renameGetters } from '../helpers/update-javascript.js';

test('update-javascript > template-only (3)', function () {
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

  const newFile = updateJavaScript(oldFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(
    newFile,
    normalizeFile([
      `import styles from './styles.css';`,
      ``,
      `<template>`,
      `  <div class={{styles.container}}>`,
      `    Hello world!`,
      `  </div>`,
      `</template>`,
      ``,
    ]),
  );

  const newFile2 = updateJavaScript(newFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(newFile2, newFile);
});
