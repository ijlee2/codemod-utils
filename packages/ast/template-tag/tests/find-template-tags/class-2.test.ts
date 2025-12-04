import { assert, createFile } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';
import { testOnPosix } from '../helpers/index.js';

testOnPosix('find-template-tags > class (2)', function () {
  const oldFile = createFile([
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

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 222,
        endChar: 222,
        startByte: 152,
        startChar: 152,
      },
      contents: createFile([
        ``,
        `    <div class={{styles.container}}>`,
        `      Hello world!`,
        `    </div>`,
        `  `,
      ]),
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
