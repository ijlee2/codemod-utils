import { assert, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > template-only (3)', function () {
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

  const newFile = toEcma(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import styles from './styles.css';`,
      ``,
      `export default \``,
      `  <div class={{styles.container}}>`,
      `    Hello world!`,
      `  </div>`,
      `                   \`;`,
      ``,
    ].join('\n'),
  );
});
