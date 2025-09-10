import { assert, test } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';

test('replace-template-tag > class (3)', function () {
  const oldFile = [
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
  ].join('\n');

  const newFile = replaceTemplateTag(oldFile, {
    code: '<template>\n    New contents\n  </template>',
    range: {
      endByte: 619,
      endChar: 589,
      startByte: 413,
      startChar: 401,
    },
  });

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
      `    New contents`,
      `  </template>`,
      `}`,
    ].join('\n'),
  );
});
