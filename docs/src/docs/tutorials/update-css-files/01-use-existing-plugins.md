# Use existing plugins

We can save time if there's already a [PostCSS plugin](https://postcss.org/docs/postcss-plugins) that meets your needs.

As a concrete example, we'll use [`postcss-nested`](https://github.com/postcss/postcss-nested) to _remove_ nested code. We may want to do this for a few different reasons:

- We want to migrate away from Sass.
- We prefer native CSS while [CSS nesting remains in spec](https://www.w3.org/TR/css-nesting-1/).
- We want to remove a PostCSS plugin (our project has too many plugins).
- With [CSS modules](https://github.com/css-modules/css-modules) (class selectors are hashed), nesting isn't really needed.


## Use the CLI

Change the directory to a place where you like to keep projects. Then, run these commands:

```sh {:no-line-numbers}
# Create project
pnpx @codemod-utils/cli write-native-css

# Install dependencies
cd write-native-css
pnpm install

# Install postcss and postcss-nested
pnpm add postcss postcss-nested
```


## Scaffold step

Create a step called `remove-css-nesting`. It is to read `*.css` files and write back the file content (a no-op).

<details>

<summary>Solution</summary>

For brevity, how `src/index.ts` calls `removeCssNesting` is not shown.

::: code-group

```ts [src/steps/remove-css-nesting.ts]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

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

:::

</details>

Here's a fixture file with nested code to test the step:

::: code-group

```css [tests/fixtures/sample-project/input/app/components/ui/page.css]
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

:::

> [!NOTE]
>
> The syntax `@value` is specific to CSS modules. We will later replace it with `var()` from native CSS.


## Update step

Next, we use `postcss` and `postcss-nested` to update the file.

::: code-group

```ts [How to use PostCSS plugins]
import postcss from 'postcss';

function transform(file: string): string {
  const plugins = [/* ... */];

  return postcss(plugins).process(file).css;
}
```

:::


<details>

<summary>Solution</summary>

::: code-group

```diff [src/steps/remove-css-nesting.ts]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createFiles, findFiles } from '@codemod-utils/files';
+ import postcss from 'postcss';
+ import PostcssNestedPlugin from 'postcss-nested';

import type { Options } from '../types/index.js';

+ function transform(file: string): string {
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
+       const newFile = transform(oldFile);

-       return [filePath, oldFile];
+       return [filePath, newFile];
    }),
  );

  createFiles(fileMap, options);
}
```

:::

</details>

Run `update-test-fixtures.sh`. You will see that the `.header`, `.body`, and `@media` blocks aren't inside the `.container` block anymore.

::: code-group

```css [tests/fixtures/sample-project/output/app/components/ui/page.css]{22-39}
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

:::

> [!TIP]
>
> Often, formatting isn't preserved. Ask end-developers to use `prettier` and `stylelint` so that you can separate formatting concerns.
