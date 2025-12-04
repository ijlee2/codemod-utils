import { assert, createFile } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';
import { testOnPosix } from '../helpers/index.js';

testOnPosix('find-template-tags > template-only (2)', function () {
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

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 108,
        endChar: 108,
        startByte: 46,
        startChar: 46,
      },
      contents: createFile([
        ``,
        `  <div class={{styles.container}}>`,
        `    Hello world!`,
        `  </div>`,
        ``,
      ]),
      endRange: {
        endByte: 119,
        endChar: 119,
        startByte: 108,
        startChar: 108,
      },
      range: {
        endByte: 119,
        endChar: 119,
        startByte: 36,
        startChar: 36,
      },
      startRange: {
        endByte: 46,
        endChar: 46,
        startByte: 36,
        startChar: 36,
      },
      tagName: 'template',
      type: 'expression',
    },
  ]);
});
