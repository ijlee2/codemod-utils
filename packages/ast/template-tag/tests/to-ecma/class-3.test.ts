import { assert, createFile, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > class (3)', function () {
  const oldFile = createFile([
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
    `    <UserName @user={{@user}} />`,
    ``,
    `    <div class={{styles.container}} data-test-field="timestamp">`,
    `      {{this.timestamp}}`,
    ``,
    `  <p> 😀😀😀 Hello! 🎉🎉🎉`,
    `  </p>`,
    `    </div>`,
    `  </template>`,
    `}`,
  ]);

  const newFile = toEcma(oldFile);

  assert.strictEqual(
    newFile,
    createFile([
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
    ]),
  );

  const newFile2 = toEcma(newFile);

  assert.strictEqual(newFile2, newFile);
});
