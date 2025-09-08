import { assert, test } from '@codemod-utils/tests';

import { preprocess } from '../../src/index.js';

test('preprocess > class (1)', function () {
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

  const { javascript, templateTags } = preprocess(oldFile);

  assert.strictEqual(
    javascript,
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

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 222,
        endChar: 222,
        startByte: 152,
        startChar: 152,
      },
      contents:
        '\n    <div class={{styles.container}}>\n      Hello world!\n    </div>\n  ',
      endRange: {
        endByte: 233,
        endChar: 233,
        startByte: 222,
        startChar: 222,
      },
      range: {
        endByte: 233,
        endChar: 233,
        startByte: 142,
        startChar: 142,
      },
      startRange: {
        endByte: 152,
        endChar: 152,
        startByte: 142,
        startChar: 142,
      },
      tagName: 'template',
      type: 'class-member',
    },
  ]);
});
