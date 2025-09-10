import { assert, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { data, renameGetters } from '../helpers/update-javascript.js';

test('update-javascript > template-only (2)', function () {
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

  const newFile = updateJavaScript(oldFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(
    newFile,
    [
      `import styles from './styles.css';`,
      ``,
      `<template>`,
      `  <div class={{styles.container}}>`,
      `    Hello world!`,
      `  </div>`,
      `</template>`,
      ``,
    ].join('\n'),
  );
});
