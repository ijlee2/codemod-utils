# Use existing plugins

We can save time if there's already a [PostCSS plugin](https://postcss.org/docs/postcss-plugins) that meets your needs.

As a concrete example, we'll use [`postcss-nested`](https://github.com/postcss/postcss-nested) to _remove_ nested code. We may want to do this for a few different reasons:

- We want to migrate away from Sass.
- We prefer native CSS while [CSS nesting remains in spec](https://www.w3.org/TR/css-nesting-1/).
- We want to remove a PostCSS plugin (our project has too many plugins).
- We use [CSS modules](https://github.com/css-modules/css-modules) (class selectors are hashed) so nesting isn't needed.


## Use the CLI

Change the directory to a place where you like to keep projects. Then, run these commands:

```sh
# Create project
npx @codemod-utils/cli write-native-css

# Install dependencies
cd write-native-css
pnpm install

# Install postcss and postcss-nested as dependencies
pnpm install postcss and postcss-nested
```

> [!NOTE]
> Just like in [the main tutorial](../main-tutorial/04-step-1-update-acceptance-tests-part-1.md#remove-the-sample-step), remove the sample step, `add-end-of-line`.


## Scaffold step

Create a step called `remove-css-nesting`. It is to read `*.css` files and write back the file content (a no-op).

<details>

<summary><code>src/steps/remove-css-nesting.ts</code></summary>

For brevity, how `src/index.ts` calls `removeCssNesting()` is not shown.

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createFiles, findFiles } from '@codemod-utils/files';

import { Options } from '../types/index.js';

export function removeCssNesting(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('app/**/*.css', {
    projectRoot,
  });

  const fileMap = new Map(
    filePaths.map((filePath) => {
      const oldFile = readFileSync(join(projectRoot, filePath), 'utf8');

      return [filePath, oldFile];
    }),
  );

  createFiles(fileMap, options);
}
```

</details>

To test the step, here's a stylesheet with nested code:

<details>

<summary><code>tests/fixtures/sample-project/input/app/components/ui/page.css</code></summary>

Note, the syntax `@value` is specific to CSS modules. We will later replace it with `var()` from native CSS.

```css
@value (
  desktop,
  spacing-400,
  spacing-600
) from "my-design-tokens";

@value navigation-menu-height: 3rem;

.container {
  display: grid;
  grid-template-areas:
    "header"
    "body";
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: calc(100% - navigation-menu-height);
  overflow-y: auto;
  padding: spacing-600 spacing-400;
  scrollbar-gutter: stable;

  .header {
    grid-area: header;
  }

  .body {
    grid-area: body;
  }

  @media desktop {
    grid-template-areas:
      "header body";
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    height: 100%;
  }
}
```

</details>


## Update step

Next, we use the `postcss-nested` plugin to update the file.

```diff
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createFiles, findFiles } from '@codemod-utils/files';
+ import postcss from 'postcss';
+ import PostcssNestedPlugin from 'postcss-nested';

import { Options } from '../types/index.js';

+ function updateFile(file: string): string {
+   const plugins = [PostcssNestedPlugin()];
+ 
+   return postcss(plugins).process(file).css;
+ }
+ 
export function removeCssNesting(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('app/**/*.css', {
    projectRoot,
  });

  const fileMap = new Map(
    filePaths.map((filePath) => {
      const oldFile = readFileSync(join(projectRoot, filePath), 'utf8');
+       const newFile = updateFile(oldFile);

-       return [filePath, oldFile];
+       return [filePath, newFile];
    }),
  );

  createFiles(fileMap, options);
}
```

Run `./update-test-fixtures.sh`. You will see that `.header`, `.body`, and `@media` blocks are no longer inside the `.container` block.

<details>

<summary><code>tests/fixtures/sample-project/output/app/components/ui/page.css</code></summary>

```css
@value (
  desktop,
  spacing-400,
  spacing-600
) from "my-design-tokens";

@value navigation-menu-height: 3rem;

.container {
  display: grid;
  grid-template-areas:
    "header"
    "body";
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: calc(100% - navigation-menu-height);
  overflow-y: auto;
  padding: spacing-600 spacing-400;
  scrollbar-gutter: stable;
}

.container .header {
    grid-area: header;
  }

.container .body {
    grid-area: body;
  }

@media desktop {

.container {
    grid-template-areas:
      "header body";
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr;
    height: 100%
}
  }
```

</details>

> [!TIP]
> Often, formatting can't be preserved. Ask the consuming project to use `prettier` and `stylelint` so that you can separate formatting concerns.


<div align="center">
  <div>
    Next: <a href="./02-write-custom-plugins.md">Write custom plugins</a>
  </div>
  <div>
    Previous: <a href="./00-introduction.md">Introduction</a>
  </div>
</div>
