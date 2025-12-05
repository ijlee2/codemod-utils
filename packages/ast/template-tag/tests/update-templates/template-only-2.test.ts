import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { removeClassAttribute } from '../helpers/update-templates.js';

test('update-templates > template-only (2)', function () {
  const oldFile = normalizeFile([
    `import styles from './styles.css';`,
    ``,
    `<template>`,
    `  <div class={{styles.container}}>`,
    `    Hello world!`,
    `  </div>`,
    `</template>;`,
    ``,
  ]);

  const newFile = updateTemplates(oldFile, removeClassAttribute);

  assert.strictEqual(
    newFile,
    normalizeFile([
      `import styles from './styles.css';`,
      ``,
      `<template>`,
      `  <div>`,
      `    Hello world!`,
      `  </div>`,
      `</template>;`,
      ``,
    ]),
  );

  const newFile2 = updateTemplates(newFile, removeClassAttribute);

  assert.strictEqual(newFile2, newFile);
});
