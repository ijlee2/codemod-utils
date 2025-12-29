import { assert, normalizeFile } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';
import { testOnPosix } from '../helpers/index.js';

testOnPosix('find-template-tags > template-only (3)', function () {
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

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 123,
        endChar: 123,
        endUtf16Codepoint: 123,
        startByte: 61,
        startChar: 61,
        startUtf16Codepoint: 61,
      },
      contents: normalizeFile([
        ``,
        `  <div class={{styles.container}}>`,
        `    Hello world!`,
        `  </div>`,
        ``,
      ]),
      endRange: {
        endByte: 134,
        endChar: 134,
        endUtf16Codepoint: 134,
        startByte: 123,
        startChar: 123,
        startUtf16Codepoint: 123,
      },
      range: {
        endByte: 134,
        endChar: 134,
        endUtf16Codepoint: 134,
        startByte: 51,
        startChar: 51,
        startUtf16Codepoint: 51,
      },
      startRange: {
        endByte: 61,
        endChar: 61,
        endUtf16Codepoint: 61,
        startByte: 51,
        startChar: 51,
        startUtf16Codepoint: 51,
      },
      tagName: 'template',
      type: 'expression',
    },
  ]);
});
