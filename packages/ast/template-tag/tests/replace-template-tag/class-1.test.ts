import { assert, createFile } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';
import { testOnPosix } from '../helpers/index.js';

testOnPosix('replace-template-tag > class (1)', function () {
  const oldFile = createFile([
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ]);

  const newFile = replaceTemplateTag(oldFile, {
    code: createFile([`<template>`, `  New contents`, `</template>`]),
    range: {
      endByte: 97,
      endChar: 97,
      startByte: 97,
      startChar: 97,
    },
  });

  assert.strictEqual(
    newFile,
    createFile([
      `import Component from '@glimmer/component';`,
      ``,
      `export default class MyComponent extends Component {<template>`,
      `  New contents`,
      `</template>}`,
      ``,
    ]),
  );
});
