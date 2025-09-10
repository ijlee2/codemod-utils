import { assert, test } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';

test('find-template-tags > template-only (3)', function () {
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

  const templateTags = findTemplateTags(oldFile);

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
