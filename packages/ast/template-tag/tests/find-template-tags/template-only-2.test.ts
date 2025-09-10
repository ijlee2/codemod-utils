import { assert, test } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';

test('find-template-tags > template-only (2)', function () {
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

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 108,
        endChar: 108,
        startByte: 46,
        startChar: 46,
      },
      contents:
        '\n  <div class={{styles.container}}>\n    Hello world!\n  </div>\n',
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
