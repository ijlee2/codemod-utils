import { assert, test } from '@codemod-utils/tests';

import { preprocess } from '../../src/index.js';

test('preprocess > template only (1)', function () {
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

  const { javascript, templateTags } = preprocess(oldFile);

  assert.strictEqual(
    javascript,
    [
      `import { template as template_fd9b2463e5f141cfb5666b64daa1f11a } from "@ember/template-compiler";`,
      `import styles from './styles.css';`,
      `export default template_fd9b2463e5f141cfb5666b64daa1f11a(\``,
      `  <div class={{styles.container}}>`,
      `    Hello world!`,
      `  </div>`,
      `\`, {`,
      `    eval () {`,
      `        return eval(arguments[0]);`,
      `    }`,
      `});`,
      ``,
    ].join('\n'),
  );

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
