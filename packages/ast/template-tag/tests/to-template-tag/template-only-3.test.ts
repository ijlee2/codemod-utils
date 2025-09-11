import { assert, test } from '@codemod-utils/tests';

import { toTemplateTag } from '../../src/index.js';

test('to-template-tag > template-only (3)', function () {
  const oldFile = [
    `import { template as template_fd9b2463e5f141cfb5666b64daa1f11a } from "@ember/template-compiler";`,
    `import styles from './styles.css';`,
    ``,
    `export default template_fd9b2463e5f141cfb5666b64daa1f11a(\``,
    `  <div class={{styles.container}}>`,
    `    Hello world!`,
    `  </div>`,
    `\`, {`,
    `    eval () {`,
    `        return eval(arguments[0]);`,
    `    }`,
    `});;`,
    ``,
  ].join('\n');

  const newFile = toTemplateTag(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import styles from './styles.css';`,
      ``,
      `<template>`,
      `  <div class={{styles.container}}>`,
      `    Hello world!`,
      `  </div>`,
      `</template>`,
      ``,
    ].join('\n'),
  );
});
