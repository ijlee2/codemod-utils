import { assert, test } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';

test('replace-template-tag > class (1)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ].join('\n');

  const newFile = replaceTemplateTag(oldFile, {
    code: '<template>\n  New contents\n</template>',
    range: {
      endByte: 97,
      endChar: 97,
      startByte: 97,
      startChar: 97,
    },
  });

  assert.strictEqual(
    newFile,
    [
      `import Component from '@glimmer/component';`,
      ``,
      `export default class MyComponent extends Component {<template>`,
      `  New contents`,
      `</template>}`,
      ``,
    ].join('\n'),
  );
});
