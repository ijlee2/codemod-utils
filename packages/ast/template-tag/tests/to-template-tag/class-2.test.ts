import { assert, test } from '@codemod-utils/tests';

import { toTemplateTag } from '../../src/index.js';

test('to-template-tag > class (2)', function () {
  const oldFile = [
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
  ].join('\n');

  const newFile = toTemplateTag(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      ``,
      `import styles from './my-component.css';`,
      ``,
      `export default class MyComponent extends Component {`,
      `    <template>`,
      `    <div class={{styles.container}}>`,
      `      Hello world!`,
      `    </div>`,
      `    </template>`,
      `}`,
      ``,
    ].join('\n'),
  );
});
