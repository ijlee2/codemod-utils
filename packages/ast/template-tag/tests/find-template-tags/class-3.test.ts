import { assert, createFile, test } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';

test('find-template-tags > class (3)', function () {
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

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 287,
        endChar: 275,
        startByte: 156,
        startChar: 156,
      },
      contents: createFile([
        ``,
        `  <div`,
        `    class={{local styles "container" "highlight"}}`,
        `    data-test-field="😀😀a🎉🎉"`,
        `  >`,
        `    {{@user.name}}`,
        `  </div>`,
        ``,
      ]),
      endRange: {
        endByte: 298,
        endChar: 286,
        startByte: 287,
        startChar: 275,
      },
      range: {
        endByte: 298,
        endChar: 286,
        startByte: 146,
        startChar: 146,
      },
      startRange: {
        endByte: 156,
        endChar: 156,
        startByte: 146,
        startChar: 146,
      },
      tagName: 'template',
      type: 'expression',
    },
    {
      contentRange: {
        endByte: 608,
        endChar: 578,
        startByte: 423,
        startChar: 411,
      },
      contents: createFile([
        ``,
        `    <UserName @user={{@user}} />`,
        ``,
        `    <div class={{styles.container}} data-test-field="timestamp">`,
        `      {{this.timestamp}}`,
        ``,
        `  <p> 😀😀😀 Hello! 🎉🎉🎉`,
        `  </p>`,
        `    </div>`,
        `  `,
      ]),
      endRange: {
        endByte: 619,
        endChar: 589,
        startByte: 608,
        startChar: 578,
      },
      range: {
        endByte: 619,
        endChar: 589,
        startByte: 413,
        startChar: 401,
      },
      startRange: {
        endByte: 423,
        endChar: 411,
        startByte: 413,
        startChar: 401,
      },
      tagName: 'template',
      type: 'class-member',
    },
  ]);
});
