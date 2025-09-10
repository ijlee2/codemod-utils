import { assert, test } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';

test('find-template-tags > template-only (5)', function () {
  const oldFile = [
    `import type { TOC } from '@ember/component/template-only';`,
    `import { isTesting, macroCondition } from '@embroider/macros';`,
    ``,
    `import styles from './image.css';`,
    ``,
    `interface ProductsProductImageSignature {`,
    `  Args: {`,
    `    src: string;`,
    `  };`,
    `}`,
    ``,
    `const ProductsProductImageComponent: TOC<ProductsProductImageSignature> =`,
    `  macroCondition(isTesting())`,
    `    ? <template>`,
    `        <div class={{styles.placeholder-image}}></div>`,
    `      </template>`,
    `    : <template><img alt="" class={{styles.image}} src={{@src}} /></template>;`,
    ``,
    `export default ProductsProductImageComponent;`,
    ``,
    `declare module '@glint/environment-ember-loose/registry' {`,
    `  export default interface Registry {`,
    `    'Products::Product::Image': typeof ProductsProductImageComponent;`,
    `    'products/product/image': typeof ProductsProductImageComponent;`,
    `  }`,
    `}`,
    ``,
  ].join('\n');

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 417,
        endChar: 417,
        startByte: 355,
        startChar: 355,
      },
      contents:
        '\n        <div class={{styles.placeholder-image}}></div>\n      ',
      endRange: {
        endByte: 428,
        endChar: 428,
        startByte: 417,
        startChar: 417,
      },
      range: {
        endByte: 428,
        endChar: 428,
        startByte: 345,
        startChar: 345,
      },
      startRange: {
        endByte: 355,
        endChar: 355,
        startByte: 345,
        startChar: 345,
      },
      tagName: 'template',
      type: 'expression',
    },
    {
      contentRange: {
        endByte: 495,
        endChar: 495,
        startByte: 445,
        startChar: 445,
      },
      contents: '<img alt="" class={{styles.image}} src={{@src}} />',
      endRange: {
        endByte: 506,
        endChar: 506,
        startByte: 495,
        startChar: 495,
      },
      range: {
        endByte: 506,
        endChar: 506,
        startByte: 435,
        startChar: 435,
      },
      startRange: {
        endByte: 445,
        endChar: 445,
        startByte: 435,
        startChar: 435,
      },
      tagName: 'template',
      type: 'expression',
    },
  ]);
});
