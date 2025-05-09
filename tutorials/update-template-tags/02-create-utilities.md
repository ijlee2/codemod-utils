# Create utilities

In [the previous chapter](./01-a-simple-example.md), we read `*.{gjs,gts}` files. Let's take small steps to update these files.


## Parse file

Instead of directly consuming `content-tag`, we'll create **wrapper functions**. Wrapping code helps us minimize the impact of a breaking change in `content-tag`.

Since `@codemod-utils` doesn't an official package yet, let's create utilities in `src/utils`.

<details>

<summary><code>src/utils/ast/template-tag.ts</code></summary>

```ts
import { Preprocessor } from 'content-tag';

const BufferMap = new Map<string, ArrayBuffer>();

function getBuffer(str: string): ArrayBuffer {
  let buffer = BufferMap.get(str);

  if (!buffer) {
    buffer = Buffer.from(str);
    BufferMap.set(str, buffer);
  }

  return buffer;
}

function sliceByteRange(
  str: string,
  indexStart: number,
  indexEnd?: number,
): string {
  const buffer = getBuffer(str);

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return buffer.slice(indexStart, indexEnd).toString();
}

type Range = {
  endByte: number;
  endChar: number;
  startByte: number;
  startChar: number;
};

type ContentTag = {
  contentRange: Range;
  contents: string;
  endRange: Range;
  range: Range;
  startRange: Range;
  tagName: string;
  type: 'class-member' | 'expression';
};

export function parse(file: string): ContentTag[] {
  const preprocessor = new Preprocessor();

  return preprocessor.parse(file);
}

export function replaceTemplate(
  file: string,
  options: {
    contents: string;
    range: Range;
  },
): string {
  const { contents, range } = options;

  return [
    sliceByteRange(file, 0, range.startByte),
    '<template>',
    contents,
    '</template>',
    sliceByteRange(file, range.endByte, undefined),
  ].join('');
}
```

</details>

<details>

<summary><code>src/steps/remove-test-selectors.ts</code></summary>

```diff
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';
+ import { parse } from '../utils/ast/template-tag.js';

export function removeTestSelectors(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('app/components/**/*.{gjs,gts}', {
    projectRoot,
  });

  const fileMap = new Map(
    filePaths.map((filePath) => {
      const file = readFileSync(join(projectRoot, filePath), 'utf8');
+       const contentTags = parse(file);
+
+       contentTags.forEach((contentTag) => {
+         console.log(contentTag);
+       });

      return [filePath, file];
    }),
  );

  createFiles(fileMap, options);
}
```

</details>

We can run tests to understand what `parse()` returns.

<details>

<summary>Expected output</summary>

The fixture file has 3 `<template>` tags, so the array `contentTags` has 3 elements. The object keys that matter to us are `contents` and `range`.

```sh
❯ pnpm test

{
  type: 'expression',
  tagName: 'template',
  contents: '\n' +
    '  <div class={{styles.control}}>\n' +
    '    <button\n' +
    '      data-test-button="Increment"\n' +
    '      type="button"\n' +
    '      {{on "click" @onClick}}\n' +
    '    >\n' +
    '      Increment by 1\n' +
    '    </button>\n' +
    '  </div>\n',
  range: { startByte: 186, endByte: 388, startChar: 186, endChar: 388 },
  startRange: { startByte: 186, endByte: 196, startChar: 186, endChar: 196 },
  contentRange: { startByte: 196, endByte: 377, startChar: 196, endChar: 377 },
  endRange: { startByte: 377, endByte: 388, startChar: 377, endChar: 388 }
}
{
  type: 'expression',
  tagName: 'template',
  contents: '\n' +
    '    <div class={{styles.display}}>\n' +
    '      Count:\n' +
    '      <p class={{styles.count}} data-test-count ...attributes>\n' +
    '        {{@count}}\n' +
    '      </p>\n' +
    '    </div>\n' +
    '  ',
  range: { startByte: 408, endByte: 584, startChar: 408, endChar: 584 },
  startRange: { startByte: 408, endByte: 418, startChar: 408, endChar: 418 },
  contentRange: { startByte: 418, endByte: 573, startChar: 418, endChar: 573 },
  endRange: { startByte: 573, endByte: 584, startChar: 573, endChar: 584 }
}
{
  type: 'class-member',
  tagName: 'template',
  contents: '\n' +
    '      <div class={{styles.container}}>\n' +
    '        <Control\n' +
    '          @onClick={{this.increment}}\n' +
    '          />\n' +
    '        <Display @count={{this.count}} data-test-my-count />\n' +
    '      </div>\n' +
    '    ',
  range: { startByte: 711, endByte: 918, startChar: 711, endChar: 918 },
  startRange: { startByte: 711, endByte: 721, startChar: 711, endChar: 721 },
  contentRange: { startByte: 721, endByte: 907, startChar: 721, endChar: 907 },
  endRange: { startByte: 907, endByte: 918, startChar: 907, endChar: 918 }
}
```

</details>

> [!NOTE]
> Because `range.startByte` is monotonically increasing, we conclude that `contentTags` is a sorted array. The `<template>` tag, which appears first in the file, appears first in the array.


## Create contents

Next, we use `@codemod-utils/ast-template` to remove all test selectors.

<details>

<summary><code>src/steps/remove-test-selectors.ts</code></summary>

```diff
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

+ import { AST } from '@codemod-utils/ast-template';
import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';
import { parse } from '../utils/ast.js';

+ function removeDataTestAttributes(file: string): string {
+   const traverse = AST.traverse();
+ 
+   const ast = traverse(file, {
+     AttrNode(node) {
+       if (!node.name.startsWith('data-test')) {
+         return;
+       }
+ 
+       return null;
+     },
+   });
+ 
+   return AST.print(ast);
+ }
+
export function removeTestSelectors(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('app/components/**/*.{gjs,gts}', {
    projectRoot,
  });

  const fileMap = new Map(
    filePaths.map((filePath) => {
      const file = readFileSync(join(projectRoot, filePath), 'utf8');
      const contentTags = parse(file);

      contentTags.forEach((contentTag) => {
-         console.log(contentTag);
+         const contents = removeDataTestAttributes(contentTag.contents);
+
+         console.log(contents);
      });

      return [filePath, file];
    }),
  );

  createFiles(fileMap, options);
}
```

</details>


## Replace templates

Last but not least, we use `replaceTemplate()` to replace the contents of each `<template>` tag. Because a file may have multiple tags, we update the tags in the reverse order.

<details>

<summary><code>src/steps/remove-test-selectors.ts</code></summary>

```diff
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AST } from '@codemod-utils/ast-template';
import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';
- import { parse } from '../utils/ast.js';
+ import { parse, replaceTemplate } from '../utils/ast.js';

function removeDataTestAttributes(file: string): string {
  const traverse = AST.traverse();

  const ast = traverse(file, {
    AttrNode(node) {
      if (!node.name.startsWith('data-test')) {
        return;
      }

      return null;
    },
  });

  return AST.print(ast);
}

export function removeTestSelectors(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('app/components/**/*.{gjs,gts}', {
    projectRoot,
  });

  const fileMap = new Map(
    filePaths.map((filePath) => {
-       const file = readFileSync(join(projectRoot, filePath), 'utf8');
+       let file = readFileSync(join(projectRoot, filePath), 'utf8');
      const contentTags = parse(file);

-       contentTags.forEach((contentTag) => {
+       contentTags.reverse().forEach((contentTag) => {
        const contents = removeDataTestAttributes(contentTag.contents);

-         console.log(contents);
+         file = replaceTemplate(file, {
+           contents,
+           range: contentTag.range,
+         });
      });

      return [filePath, file];
    }),
  );

  createFiles(fileMap, options);
}
```

</details>

Run `./update-test-fixtures.sh`. You should see that (1) only the test selectors are removed and (2) formatting is preserved.

<details>

<summary><code>tests/fixtures/sample-project/output/app/components/my-component.gjs</code></summary>

```diff
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import styles from './my-component.css';

const Control =
<template>
  <div class={{styles.control}}>
    <button
-       data-test-button="Increment"
      type="button"
      {{on "click" @onClick}}
    >
      Increment by 1
    </button>
  </div>
</template>

const Display =
  <template>
    <div class={{styles.display}}>
      Count:
-       <p class={{styles.count}} data-test-count ...attributes>
+       <p class={{styles.count}} ...attributes>
        {{@count}}
      </p>
    </div>
  </template>

export default class MyComponent extends Component {
  @tracked count = 0;

  increment = () => {
    this.count++;
  }

    <template>
      <div class={{styles.container}}>
        <Control
          @onClick={{this.increment}}
          />
-         <Display @count={{this.count}} data-test-my-count />
+         <Display @count={{this.count}} />
      </div>
    </template>
}
```

</details>


<div align="center">
  <div>
    Next: <a href="./03-conclusion.md">Conclusion</a>
  </div>
  <div>
    Previous: <a href="./01-a-simple-example.md">A simple example</a>
  </div>
</div>
