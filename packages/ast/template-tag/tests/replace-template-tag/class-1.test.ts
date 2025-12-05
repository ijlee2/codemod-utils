import { assert, normalizeFile } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';
import { testOnPosix } from '../helpers/index.js';

testOnPosix('replace-template-tag > class (1)', function () {
  const oldFile = normalizeFile([
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ]);

  const newFile = replaceTemplateTag(oldFile, {
    code: normalizeFile([`<template>`, `  New contents`, `</template>`]),
    range: {
      endByte: 97,
      endChar: 97,
      startByte: 97,
      startChar: 97,
    },
  });

  assert.strictEqual(
    newFile,
    normalizeFile([
      `import Component from '@glimmer/component';`,
      ``,
      `export default class MyComponent extends Component {<template>`,
      `  New contents`,
      `</template>}`,
      ``,
    ]),
  );
});
