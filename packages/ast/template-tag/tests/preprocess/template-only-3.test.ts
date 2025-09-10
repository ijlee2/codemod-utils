import { assert, test } from '@codemod-utils/tests';

import { preprocess } from '../../src/index.js';

test('preprocess > template-only (3)', function () {
  const oldFile = [
    `import styles from './styles.css';`,
    ``,
    `export default <template>`,
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
        endByte: 123,
        endChar: 123,
        startByte: 61,
        startChar: 61,
      },
      contents:
        '\n  <div class={{styles.container}}>\n    Hello world!\n  </div>\n',
      endRange: {
        endByte: 134,
        endChar: 134,
        startByte: 123,
        startChar: 123,
      },
      range: {
        endByte: 134,
        endChar: 134,
        startByte: 51,
        startChar: 51,
      },
      startRange: {
        endByte: 61,
        endChar: 61,
        startByte: 51,
        startChar: 51,
      },
      tagName: 'template',
      type: 'expression',
    },
  ]);
});
