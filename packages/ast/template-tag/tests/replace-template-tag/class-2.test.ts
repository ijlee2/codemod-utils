import { assert, test } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';

test('replace-template-tag > class (2)', function () {
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

  const newFile = replaceTemplateTag(oldFile, {
    code: '<template>\n    New contents\n  </template>',
    range: {
      endByte: 233,
      endChar: 233,
      startByte: 142,
      startChar: 142,
    },
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
