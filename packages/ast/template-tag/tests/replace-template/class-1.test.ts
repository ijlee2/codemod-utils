import { assert, test } from '@codemod-utils/tests';

import { replaceTemplate } from '../../src/index.js';

test('replace-template > class (1)', function () {
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

  const newFile = replaceTemplate(oldFile, {
    range: {
      endByte: 233,
      endChar: 233,
      startByte: 142,
      startChar: 142,
    },
    template: '\n    New contents\n  ',
  });

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      ``,
      `import styles from './my-component.css';`,
      ``,
      `export default class MyComponent extends Component {`,
      `  <template>`,
      `    New contents`,
      `  </template>`,
      `}`,
      ``,
    ].join('\n'),
  );
});
