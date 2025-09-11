import { assert, test } from '@codemod-utils/tests';

import { toTemplateTag } from '../../src/index.js';

test('to-template-tag > class (3)', function () {
  const oldFile = [
    `import { template as template_fd9b2463e5f141cfb5666b64daa1f11a } from "@ember/template-compiler";`,
    `import Component from '@glimmer/component';`,
    `import { local } from 'embroider-css-modules';`,
    ``,
    `import styles from './example.css';`,
    ``,
    `const UserName = template_fd9b2463e5f141cfb5666b64daa1f11a(\``,
    `  <div`,
    `    class={{local styles "container" "highlight"}}`,
    `    data-test-field="😀😀a🎉🎉"`,
    `  >`,
    `    {{@user.name}}`,
    `  </div>`,
    `\`, {`,
    `    eval () {`,
    `        return eval(arguments[0]);`,
    `    }`,
    `});`,
    ``,
    `export default class MyComponent extends Component {`,
    `  get timestamp(): string {`,
    `    return 'yesterday';`,
    `  }`,
    ``,
    `  static{`,
    `    template_fd9b2463e5f141cfb5666b64daa1f11a(\``,
    `<UserName @user={{@user}} />`,
    ``,
    `<div class={{styles.container}} data-test-field="timestamp">`,
    `  {{this.timestamp}}`,
    ``,
    `<p> 😀😀😀 Hello! 🎉🎉🎉`,
    `</p>`,
    `</div>`,
    `\`, {`,
    `        component: this,`,
    `        eval () {`,
    `            return eval(arguments[0]);`,
    `        }`,
    `    });`,
    `}`,
    `}`,
  ].join('\n');

  const newFile = toTemplateTag(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      `import { local } from 'embroider-css-modules';`,
      ``,
      `import styles from './example.css';`,
      ``,
      `const UserName = <template>`,
      `  <div`,
      `    class={{local styles "container" "highlight"}}`,
      `    data-test-field="😀😀a🎉🎉"`,
      `  >`,
      `    {{@user.name}}`,
      `  </div>`,
      `</template>;`,
      ``,
      `export default class MyComponent extends Component {`,
      `  get timestamp(): string {`,
      `    return 'yesterday';`,
      `  }`,
      ``,
      `  <template>`,
      `  <UserName @user={{@user}} />`,
      ``,
      `  <div class={{styles.container}} data-test-field="timestamp">`,
      `    {{this.timestamp}}`,
      ``,
      `  <p> 😀😀😀 Hello! 🎉🎉🎉`,
      `  </p>`,
      `  </div>`,
      `  </template>`,
      `}`,
    ].join('\n'),
  );

  const newFile2 = toTemplateTag(newFile);

  // TODO: Fix runtime error to guarantee idempotence
  assert.strictEqual(newFile2, newFile);
});
