import { assert, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { removeClassAttribute } from '../helpers/update-templates.js';

test('update-templates > class (2)', function () {
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

  const newFile = updateTemplates(oldFile, removeClassAttribute);

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      ``,
      `import styles from './my-component.css';`,
      ``,
      `export default class MyComponent extends Component {`,
      `  <template>`,
      `    <div>`,
      `      Hello world!`,
      `    </div>`,
      `  </template>`,
      `}`,
      ``,
    ].join('\n'),
  );
});
