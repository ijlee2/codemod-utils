import { assert, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > class (2)', function () {
  const oldFile = [
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
  ].join('\n');

  const newFile = toEcma(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import { template as template_fd9b2463e5f141cfb5666b64daa1f11a } from "@ember/template-compiler";`,
      `import Component from '@glimmer/component';`,
      `import styles from './my-component.css';`,
      `export default class MyComponent extends Component {`,
      `    static{`,
      `        template_fd9b2463e5f141cfb5666b64daa1f11a(\``,
      `    <div class={{styles.container}}>`,
      `      Hello world!`,
      `    </div>`,
      `  \`, {`,
      `            component: this,`,
      `            eval () {`,
      `                return eval(arguments[0]);`,
      `            }`,
      `        });`,
      `    }`,
      `}`,
      ``,
    ].join('\n'),
  );
});
