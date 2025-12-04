import { assert, createFile, test } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';

test('replace-template-tag > template-only (5)', function () {
  const oldFile = createFile([
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
  ]);

  const newFile = replaceTemplateTag(oldFile, {
    code: '<template>New contents</template>',
    range: {
      endByte: 428,
      endChar: 428,
      startByte: 345,
      startChar: 345,
    },
  });

  assert.strictEqual(
    newFile,
    createFile([
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
      `    ? <template>New contents</template>`,
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
    ]),
  );
});
