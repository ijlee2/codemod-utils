import { assert, test } from '@codemod-utils/tests';

import { replaceTemplate } from '../../src/index.js';

test('replace-template > template-only (3)', function () {
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

  const newFile = replaceTemplate(oldFile, {
    range: {
      endByte: 134,
      endChar: 134,
      startByte: 51,
      startChar: 51,
    },
    template: '\n  New contents\n',
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
