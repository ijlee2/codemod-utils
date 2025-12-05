import { assert, normalizeFile } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';
import { testOnPosix } from '../helpers/index.js';

testOnPosix('replace-template-tag > class (2)', function () {
  const oldFile = normalizeFile([
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

  const newFile = replaceTemplateTag(oldFile, {
    code: normalizeFile([`<template>`, `    New contents`, `  </template>`]),
    range: {
      endByte: 233,
      endChar: 233,
      startByte: 142,
      startChar: 142,
    },
  });

  assert.strictEqual(
    newFile,
    normalizeFile([
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
    ]),
  );
});
