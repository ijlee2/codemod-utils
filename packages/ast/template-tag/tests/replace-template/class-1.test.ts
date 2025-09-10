import { assert, test } from '@codemod-utils/tests';

import { replaceTemplate } from '../../src/index.js';

test('replace-template > class (1)', function () {
  const oldFile = [
    `import Component from '@glimmer/component';`,
    ``,
    `export default class MyComponent extends Component {}`,
    ``,
  ].join('\n');

  const newFile = replaceTemplate(oldFile, {
    range: {
      endByte: 97,
      endChar: 97,
      startByte: 97,
      startChar: 97,
    },
    template: '\n  New contents\n',
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
