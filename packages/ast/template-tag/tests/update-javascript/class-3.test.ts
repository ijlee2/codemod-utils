import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { data, renameGetters } from '../helpers/update-javascript.js';

test('update-javascript > class (3)', function () {
  const oldFile = normalizeFile([
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

  const newFile = updateJavaScript(oldFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(
    newFile,
    normalizeFile([
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
      `  // Assigned new name`,
      `  get __timestamp(): string {`,
      `    return 'yesterday';`,
      `  }`,
      ``,
      `  <template>`,
      `  <UserName @user={{@user}} />`,
      ``,
      `  <div class={{styles.container}} data-test-field="timestamp">`,
      `    {{this.timestamp}}`,
      ``,
      `  <p> 😀😀😀 Hello! 🎉🎉🎉`,
      `  </p>`,
      `  </div>`,
      `  </template>`,
      `}`,
    ]),
  );

  const newFile2 = updateJavaScript(newFile, (code) => {
    return renameGetters(code, data);
  });

  // TODO: Guarantee idempotence
  assert.notStrictEqual(newFile2, newFile);

  assert.strictEqual(
    newFile2,
    normalizeFile([
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
      `  // Assigned new name`,
      `  get __timestamp(): string {`,
      `    return 'yesterday';`,
      `  }`,
      ``,
      `  <template>`,
      `  <UserName @user={{@user}} />`,
      ``,
      `  <div class={{styles.container}} data-test-field="timestamp">`,
      `  {{this.timestamp}}`,
      ``,
      `  <p> 😀😀😀 Hello! 🎉🎉🎉`,
      `  </p>`,
      `  </div>`,
      `  </template>`,
      `}`,
    ]),
  );
});
