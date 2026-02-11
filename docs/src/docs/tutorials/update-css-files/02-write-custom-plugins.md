# Write custom plugins

If there isn't a PostCSS plugin that meets your needs, you will need to [write your own](https://postcss.org/api/).

[In the previous chapter](./01-use-existing-plugins), we encountered `@value`, a syntax that is specific to CSS modules. We'll familiarize with the plugin API by replacing `@value` with `var()` from native CSS.


## Scaffold step

First, create the utility file `src/utils/css/postcss-plugins.ts` so that we can scaffold a PostCSS plugin. For simplicity, we'll disable type checks.

::: code-group

```ts [src/utils/css/postcss-plugins.ts]
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export function PostcssRemoveAtValue() {
  return {
    postcssPlugin: 'postcss-remove-at-value',

    prepare() {
      return {};
    },
  };
}
```

:::

Then, create the step `remove-at-value`. Similarly to `remove-css-nesting`, it is to use the custom plugin to update `*.css` files.

<details>

<summary>Solution</summary>

::: code-group

```ts [src/steps/remove-at-value.ts]{11}
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createFiles, findFiles } from '@codemod-utils/files';
import postcss from 'postcss';

import type { Options } from '../types/index.js';
import { PostcssRemoveAtValue } from '../utils/css/postcss-plugins.js';

function transform(file: string): string {
  const plugins = [PostcssRemoveAtValue()];

  return postcss(plugins).process(file).css;
}

export function removeAtValue(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('app/**/*.css', {
    projectRoot,
  });

  const fileMap = new Map(
    filePaths.map((filePath) => {
      const oldFile = readFileSync(join(projectRoot, filePath), 'utf8');
      const newFile = transform(oldFile);

      return [filePath, newFile];
    }),
  );

  createFiles(fileMap, options);
}
```

:::

</details>


## Handle media queries

Currently, native CSS doesn't support using `var()` in media queries. So expressions like `@media desktop` (note, `desktop` is some value) need to be changed.

::: code-group

```css [Example (Before)]
@media desktop {
  /* ... */
}
```

```css [Example (After)]
@media only screen and (width >= 960px) {
  /* ... */
}
```

:::

Since `@media` starts with an `@` symbol, we use PostCSS' `AtRule` to target these nodes.

<details>

<summary>Solution</summary>

::: code-group

```diff [src/utils/css/postcss-plugins.ts]
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
+ const breakpoints = new Map([
+   ['mobile', 'only screen and (width < 480px)'],
+   ['tablet', 'only screen and (width >= 480px) and (width < 960px)'],
+   ['desktop', 'only screen and (width >= 960px)'],
+ ]);
+ 
export function PostcssRemoveAtValue() {
  return {
    postcssPlugin: 'postcss-remove-at-value',

    prepare() {
-       return {};
+       return {
+         AtRule(node) {
+           switch (node.name) {
+             case 'media': {
+               if (breakpoints.has(node.params)) {
+                 node.params = breakpoints.get(node.params);
+               }
+ 
+               break;
+             }
+           }
+         },
+       };
    },
  };
}
```

:::

</details>

Afterwards, run `update-test-fixtures.sh` to see that media queries have been changed.

::: code-group

```diff [tests/fixtures/sample-project/output/app/components/ui/page.css]
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

- @media desktop {
+ @media only screen and (width >= 960px) {

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


## Handle values

The output fixture still shows values in various expressions (e.g. `spacing-600 spacing-400`, `calc(100% - navigation-menu-height)`). To replace them with CSS variables, the codemod needs to know that `spacing-400`, `spacing-600`, and `navigation-menu-height` are related to the problem that we want to solve.


### Extend plugin {#handle-values-extend-plugin}

Consider the import statements:

```css
@value (
  desktop,
  spacing-400,
  spacing-600
) from "my-design-tokens";

@value navigation-menu-height: 3rem;
```

Since `@value` also starts with an `@` symbol, we can extend the plugin's `AtRule` to record all values. Let's create a `Map` to record a value's name and how to change the name.

<details>

<summary>Solution</summary>

For brevity, I already added `node.remove()` and `OnceExit`. These, respectively, remove the `@value` imports and log `valueMap` as a sanity check.

::: code-group

```diff [src/utils/css/postcss-plugins.ts]
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const breakpoints = new Map([
  ['mobile', 'only screen and (width < 480px)'],
  ['tablet', 'only screen and (width >= 480px) and (width < 960px)'],
  ['desktop', 'only screen and (width >= 960px)'],
]);

+ function recordValues(expression: string, valueMap: Map<string, string>): void {
+   // ...
+ }
+ 
export function PostcssRemoveAtValue() {
  return {
    postcssPlugin: 'postcss-remove-at-value',

    prepare() {
+       const valueMap = new Map<string, string>();
+ 
      return {
        AtRule(node) {
          switch (node.name) {
            case 'media': {
              if (breakpoints.has(node.params)) {
                node.params = breakpoints.get(node.params);
              }

              break;
            }
+ 
+             case 'value': {
+               recordValues(node.params, valueMap);
+ 
+               node.remove();
+ 
+               break;
+             }
          }
        },
+ 
+         OnceExit() {
+           console.log(valueMap);
+         },
      };
    },
  };
}
```

:::

</details>


### Record values {#handle-values-record-values}

Next, let's implement `recordValues`.

```ts
function recordValues(expression: string, valueMap: Map<string, string>): void {
  // ...
}
```

It needs to parse `expression` to find all values in an expression, then update `valueMap` by recording each value's old and new names.

> [!NOTE]
>
> CSS modules allows [a few different patterns for importing values](https://github.com/css-modules/postcss-modules-values/blob/v4.0.0/README.md), so the correct solution will be far from obvious. Feel free to jump to the solution below.

<details>

<summary>Solution</summary>

```ts
function recordValues(expression: string, valueMap: Map<string, string>) {
  const isGlobal = expression.includes('"my-design-tokens"');

  if (!isGlobal) {
    const [oldSyntax, ...values] = expression.split(':');

    valueMap.set(oldSyntax, values.join(':').trim());

    return;
  }

  const matches = expression.match(/\(([^)]+)\)/);

  if (!matches) {
    return;
  }

  matches[1].split(',').forEach((str) => {
    const oldSyntax = str.trim();

    if (oldSyntax === '') {
      return;
    }

    const isRenamed = oldSyntax.includes(' as ');

    if (!isRenamed) {
      valueMap.set(oldSyntax, `var(--${oldSyntax})`);

      return;
    }

    const [originalName, newName] = oldSyntax.split(' as ');

    valueMap.set(newName.trim(), `var(--${originalName.trim()})`);
  });
}
```

</details>

Since logging is enabled, we can run the `test` script to see how values will be converted.

```sh
Map(4) {
  'desktop' => 'var(--desktop)',
  'spacing-400' => 'var(--spacing-400)',
  'spacing-600' => 'var(--spacing-600)',
  'navigation-menu-height' => '3rem'
}
```


### Consume recorded values {#handle-values-consume-recorded-values}

Finally, we replace the values with the corresponding CSS variables or literals.

<details>

<summary>Solution</summary>

It's hard to update dynamic expressions inside `calc()`. For simplicity, we'll warn the user and ask them to update the code.

::: code-group

```diff [src/steps/remove-at-value.ts]
// ...

export function PostcssRemoveAtValue() {
  return {
    postcssPlugin: 'postcss-remove-at-value',

    prepare() {
+       const errorMessages: string[] = [];
      const valueMap = new Map<string, string>();

      return {
        AtRule(node) {
          switch (node.name) {
            case 'media': {
              if (breakpoints.has(node.params)) {
                node.params = breakpoints.get(node.params);
+               } else if (tokenValues.has(node.params)) {
+                 node.params = tokenValues.get(node.params);
              }

              break;
            }

            case 'value': {
              recordValues(node.params, valueMap);

              node.remove();

              break;
            }
          }
        },

+         Declaration(node) {
+           const matches = node.value.match(/calc\(([^)]+)\)/);
+ 
+           // Unable to handle calc() expressions
+           if (matches) {
+             const warn = Array.from(valueMap.keys()).some((key) => {
+               return matches[1].includes(key);
+             });
+ 
+             if (warn) {
+               errorMessages.push(
+                 `Couldn't update \`${node.prop}\`, originally on line ${node.source.start.line} (approx.)`,
+               );
+             }
+ 
+             return;
+           }
+ 
+           const values = node.value.split(' ');
+ 
+           const newValues = values.map((value) => {
+             return valueMap.has(value) ? valueMap.get(value) : value;
+           });
+ 
+           node.value = newValues.join(' ');
+         },
+ 
        OnceExit() {
-           console.log(valueMap);
+           console.log(errorMessages.join('\n'));
        },
      };
    },
  };
}
```

:::

</details>

Run `update-test-fixtures.sh` once more. You'll see that `@value` imports and values have been removed, wherever possible.

::: code-group

```diff [tests/fixtures/sample-project/output/app/components/ui/page.css]
- @value (
-   desktop,
-   spacing-400,
-   spacing-600
- ) from "my-design-tokens";
- 
- @value navigation-menu-height: 3rem;
- 
.container {
  display: grid;
  grid-template-areas:
    "header"
    "body";
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  height: calc(100% - navigation-menu-height);
  overflow-y: auto;
-   padding: spacing-600 spacing-400;
+   padding: var(--spacing-600) var(--spacing-400);
  scrollbar-gutter: stable;
}

.container .header {
    grid-area: header;
  }

.container .body {
    grid-area: body;
  }

@media only screen and (width >= 960px) {

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
