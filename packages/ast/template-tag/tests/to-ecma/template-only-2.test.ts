import { assert, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > template-only (2)', function () {
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

  const newFile = toEcma(oldFile);

  assert.strictEqual(
    newFile,
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
});
