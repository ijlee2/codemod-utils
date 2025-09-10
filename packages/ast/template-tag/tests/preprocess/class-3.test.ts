import { assert, test } from '@codemod-utils/tests';

import { preprocess } from '../../src/index.js';

test('preprocess > class (3)', function () {
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

  const { javascript, templateTags } = preprocess(oldFile);

  assert.strictEqual(
    javascript,
    [
      `import { template as template_fd9b2463e5f141cfb5666b64daa1f11a } from "@ember/template-compiler";`,
      `import Component from '@glimmer/component';`,
      `import { local } from 'embroider-css-modules';`,
      `import styles from './example.css';`,
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
      `export default class MyComponent extends Component {`,
      `    get timestamp(): string {`,
      `        return 'yesterday';`,
      `    }`,
      `    static{`,
      `        template_fd9b2463e5f141cfb5666b64daa1f11a(\``,
      `    <UserName @user={{@user}} />`,
      ``,
      `    <div class={{styles.container}} data-test-field="timestamp">`,
      `      {{this.timestamp}}`,
      ``,
      `  <p> 😀😀😀 Hello! 🎉🎉🎉`,
      `  </p>`,
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

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 287,
        endChar: 275,
        startByte: 156,
        startChar: 156,
      },
      contents:
        '\n' +
        '  <div\n' +
        '    class={{local styles "container" "highlight"}}\n' +
        '    data-test-field="😀😀a🎉🎉"\n' +
        '  >\n' +
        '    {{@user.name}}\n' +
        '  </div>\n',
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
      contents:
        '\n' +
        '    <UserName @user={{@user}} />\n' +
        '\n' +
        '    <div class={{styles.container}} data-test-field="timestamp">\n' +
        '      {{this.timestamp}}\n' +
        '\n' +
        '  <p> 😀😀😀 Hello! 🎉🎉🎉\n' +
        '  </p>\n' +
        '    </div>\n' +
        '  ',
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
