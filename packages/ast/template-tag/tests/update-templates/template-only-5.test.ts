import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { removeClassAttribute } from '../helpers/update-templates.js';

test('update-templates > template-only (5)', function () {
  const oldFile = normalizeFile([
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

  const newFile = updateTemplates(oldFile, removeClassAttribute);

  assert.strictEqual(
    newFile,
    normalizeFile([
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
      `        <div></div>`,
      `      </template>`,
      `    : <template><img alt="" src={{@src}} /></template>;`,
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

  const newFile2 = updateTemplates(newFile, removeClassAttribute);

  assert.strictEqual(newFile2, newFile);
});
