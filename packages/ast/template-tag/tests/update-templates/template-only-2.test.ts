import { assert, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { removeClassAttribute } from '../helpers/update-templates.js';

test('update-templates > template-only (2)', function () {
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

  const newFile = updateTemplates(oldFile, removeClassAttribute);

  assert.strictEqual(
    newFile,
    [
      `import styles from './styles.css';`,
      ``,
      `export default <template>`,
      `  <div>`,
      `    Hello world!`,
      `  </div>`,
      `</template>;`,
      ``,
    ].join('\n'),
  );
});
