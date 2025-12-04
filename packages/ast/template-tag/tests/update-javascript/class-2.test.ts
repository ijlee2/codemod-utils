import { assert, createFile, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { data, renameGetters } from '../helpers/update-javascript.js';

test('update-javascript > class (2)', function () {
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

  const newFile = updateJavaScript(oldFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(
    newFile,
    createFile([
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
    ]),
  );

  const newFile2 = updateJavaScript(newFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(newFile2, newFile);
});
