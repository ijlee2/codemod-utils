import { assert, test } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';

test('replace-template-tag > template-only (3)', function () {
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

  const newFile = replaceTemplateTag(oldFile, {
    code: '<template>\n  New contents\n</template>',
    range: {
      endByte: 134,
      endChar: 134,
      startByte: 51,
      startChar: 51,
    },
  });

  assert.strictEqual(
    newFile,
    [
      `import styles from './styles.css';`,
      ``,
      `export default <template>`,
      `  New contents`,
      `</template>;`,
      ``,
    ].join('\n'),
  );
});
