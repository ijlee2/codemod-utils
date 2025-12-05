import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { identity } from '../helpers/index.js';

test('update-javascript > update is identity (4)', function () {
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

  const newFile = updateJavaScript(oldFile, identity);

  // TODO: Guarantee identity
  assert.notStrictEqual(newFile, oldFile);

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
      `  macroCondition(isTesting()) ? <template>`,
      `          <div class={{styles.placeholder-image}}></div>`,
      `        </template> : <template><img alt="" class={{styles.image}} src={{@src}} /></template>;`,
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

  const newFile2 = updateJavaScript(newFile, identity);

  // TODO: Guarantee idempotence
  assert.notStrictEqual(newFile2, newFile);

  assert.strictEqual(
    newFile2,
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
      `  macroCondition(isTesting()) ? <template>`,
      `            <div class={{styles.placeholder-image}}></div>`,
      `          </template> : <template><img alt="" class={{styles.image}} src={{@src}} /></template>;`,
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
