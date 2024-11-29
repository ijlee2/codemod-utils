# Create utilities

In [the previous chapter](./01-a-simple-example.md), we read `*.{gjs,gts}` files. We will take small steps to update these files.


## Parse file

We avoid directly consuming `content-tag` in our steps, but create **wrappers** instead. Wrapping code helps us minimize the impact of a breaking change in `content-tag`.

Until `@codemod-utils` provides an official package, we can create utilities in `src/utils`.

<details>

<summary><code>src/utils/ast/template-tag.ts</code></summary>

```ts
import { Preprocessor } from 'content-tag';

type Range = {
  end: number;
  start: number;
};

type ContentTag = {
  contentRange: Range;
  contents: string;
  endRange: Range;
  range: Range; // range = startRange + contentRange + endRange
  startRange: Range;
  tagName: string;
  type: string;
};

export function parse(file: string) {
  const preprocessor = new Preprocessor();

  return preprocessor.parse(file) as unknown as ContentTag[];
}

export function replaceContents(
  file: string,
  options: {
    contents: string;
    range: Range;
  },
): string {
  const { contents, range } = options;

  return [
    file.substring(0, range.start),
    '<template>',
    contents,
    '</template>',
    file.substring(range.end),
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

import { Options } from '../types/index.js';
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
  range: { start: 186, end: 388 },
  startRange: { start: 186, end: 196 },
  contentRange: { start: 196, end: 377 },
  endRange: { start: 377, end: 388 }
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
  range: { start: 408, end: 584 },
  startRange: { start: 408, end: 418 },
  contentRange: { start: 418, end: 573 },
  endRange: { start: 573, end: 584 }
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
  range: { start: 711, end: 918 },
  startRange: { start: 711, end: 721 },
  contentRange: { start: 721, end: 907 },
  endRange: { start: 907, end: 918 }
}
```

</details>

> [!NOTE]
> From `range.start`, we see that `contentTags` is a sorted array. The `<template>` tag, which appears first in the file, appears first in the array.


## Create contents

Next, we use `@codemod-utils/ast-template` to remove all test selectors.

<details>

<summary><code>src/steps/remove-test-selectors.ts</code></summary>

```diff
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

+ import { AST } from '@codemod-utils/ast-template';
import { createFiles, findFiles } from '@codemod-utils/files';

import { Options } from '../types/index.js';
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


## Replace contents

Last but not least, we use `replaceContents()` to replace the contents of each `<template>` tag. Because a file may have multiple tags, we update the tags in the reverse order.

<details>

<summary><code>src/steps/remove-test-selectors.ts</code></summary>

```diff
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AST } from '@codemod-utils/ast-template';
import { createFiles, findFiles } from '@codemod-utils/files';

import { Options } from '../types/index.js';
- import { parse } from '../utils/ast.js';
+ import { parse, replaceContents } from '../utils/ast.js';

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
+         file = replaceContents(file, {
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
