# Write custom plugins

No worries if there isn't a plugin that meets your needs. PostCSS lets you [write your own](https://postcss.org/api/).

[In the previous chapter](./01-use-existing-plugins.md), we encountered the `@value` syntax, specific to CSS modules. We'll familiarize a bit with PostCSS' plugin API by replacing `@value` with `var()` from native CSS.


## Scaffold step

First, create the utility file `src/utils/css/postcss-plugins.ts`, where we can scaffold a PostCSS plugin. For simplicity, we'll disable type checks.

```ts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export const PostcssRemoveAtValue = () => {
  return {
    postcssPlugin: 'postcss-remove-at-value',

    prepare() {
      return {};
    },
  };
};
```

Then, create the step `remove-at-value`. Similarly to `remove-css-nesting`, it is to use the custom plugin to update `*.css` files.

<details>

<summary>Solution: <code>src/steps/remove-at-value.ts</code></summary>

```ts
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

</details>


## Handle media queries

Currently, native CSS doesn't support using `var()` in media queries. So expressions like `@media desktop` (note, `desktop` is some value) need to be changed.

```css
/* Before */
@media desktop {
  /* ... */
}

/* After */
@media only screen and (width >= 960px) {
  /* ... */
}
```

Since `@media` starts with an `@` symbol, we use PostCSS' `AtRule` to target these nodes.

<details>

<summary>Solution: <code>src/utils/css/postcss-plugins.ts</code></summary>

```diff
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
+ const breakpoints = new Map([
+   ['mobile', 'only screen and (width < 480px)'],
+   ['tablet', 'only screen and (width >= 480px) and (width < 960px)'],
+   ['desktop', 'only screen and (width >= 960px)'],
+ ]);
+ 
export const PostcssRemoveAtValue = () => {
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
};
```

</details>

Afterwards, run `.update-test-fixtures.sh`. Media queries in the output file have been changed.

<details>

<summary><code>tests/fixtures/sample-project/output/app/components/ui/page.css</code></summary>

```diff
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

</details>


## Handle values

To replace values in expressions, such as `spacing-600 spacing-400` and `calc(100% - navigation-menu-height)`, with CSS variables, the codemod needs to know that `spacing-400`, `spacing-600`, and `navigation-menu-height` are indeed things related to the problem that we want to solve.


### Extend plugin

Consider the import statements:

```css
@value (
  desktop,
  spacing-400,
  spacing-600
) from "my-design-tokens";

@value navigation-menu-height: 3rem;
```

Since `@value` also starts with an `@` symbol, we can extend the plugin's `AtRule` to record all values. Let's create a `Map` to keep track of the value name and how to change this name.

<details>

<summary>Solution: <code>src/utils/css/postcss-plugins.ts</code></summary>

For brevity, I already added `node.remove()` and `OnceExit`. These, respectively, remove the `@value` imports and log the map to help us understand what's going on.

```diff
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const breakpoints = new Map([
  ['mobile', 'only screen and (width < 480px)'],
  ['tablet', 'only screen and (width >= 480px) and (width < 960px)'],
  ['desktop', 'only screen and (width >= 960px)'],
]);

+ function recordValues(expression: string, valueMap: Map<string, string>) {
+   // ...
+ }
+ 
export const PostcssRemoveAtValue = () => {
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
};
```

</details>


### Record values

Next, we implement `recordValues()`, which receives two inputs: `expression` and `valueMap`. It is to parse `expression` and update `valueMap` by recording the value name and the converted syntax.

> [!NOTE]
> Because CSS modules allows [a few different possibilities for `@value` imports](https://github.com/css-modules/postcss-modules-values/blob/v4.0.0/README.md), the correct solution will be far from obvious. Give it a try before checking the solution below.

<details>

<summary>Solution: <code>recordValues()</code></summary>

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

By running the `test` command, we can see how value names will be converted.

```sh
Map(4) {
  'desktop' => 'var(--desktop)',
  'spacing-400' => 'var(--spacing-400)',
  'spacing-600' => 'var(--spacing-600)',
  'navigation-menu-height' => '3rem'
}
```


### Consume recorded values

Finally, we replace the values with the corresponding CSS variables or literals.

<details>

<summary>Solution: <code>PostcssRemoveAtValue</code></summary>

It's hard to update dynamic expressions in `calc()`. For simplicity, we'll warn the user and ask them to update the code.

```diff
export const PostcssRemoveAtValue = () => {
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
};
```

</details>

Run `.update-test-fixtures.sh` once more. You'll see that `@value` imports and values have been removed, wherever possible.

<details>

<summary><code>tests/fixtures/sample-project/output/app/components/ui/page.css</code></summary>

```diff
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

</details>


<div align="center">
  <div>
    Next: <a href="./03-conclusion.md">Conclusion</a>
  </div>
  <div>
    Previous: <a href="./01-use-existing-plugins.md">Use existing plugins</a>
  </div>
</div>
