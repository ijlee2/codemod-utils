import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > class (2)', function () {
  const oldFile = normalizeFile([
    `import Component from '@glimmer/component';`,
    ``,
    `import styles from './my-component.css';`,
    ``,
    `export default class MyComponent extends Component {`,
    `  <template>`,
    `    <div class={{styles.container}}>`,
    `      Hello world!`,
    `    </div>`,
    `  </template>`,
    `}`,
    ``,
  ]);

  const newFile = toEcma(oldFile);

  assert.strictEqual(
    newFile,
    normalizeFile([
      `import { template as template_fd9b2463e5f141cfb5666b64daa1f11a } from "@ember/template-compiler";`,
      `import Component from '@glimmer/component';`,
      ``,
      `import styles from './my-component.css';`,
      ``,
      `export default class MyComponent extends Component {`,
      `  static{`,
      `    template_fd9b2463e5f141cfb5666b64daa1f11a(\``,
      `<div class={{styles.container}}>`,
      `  Hello world!`,
      `</div>`,
      `\`, {`,
      `        component: this,`,
      `        eval () {`,
      `            return eval(arguments[0]);`,
      `        }`,
      `    });`,
      `}`,
      `}`,
      ``,
    ]),
  );

  const newFile2 = toEcma(newFile);

  assert.strictEqual(newFile2, newFile);
});
