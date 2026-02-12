# Create dynamic files

The blueprints that we added in [Chapter 2](./02-create-static-files#add-blueprints) are static: Regardless of the codemod options, we always create the same file at the same location.

In this chapter, we'll update the blueprints to be dynamic: The addon's `package.json` will display the value of `options.addon.name` instead of `'addon-1'`, and will be created at the location specified by `options.addon.location`. The same changes will occur for the test app's `package.json`.

Goals:

- Pass data
- Add delimiters
- Resolve file paths


## Pass data

A blueprint needs data (some context) to make decisions. We use [`processTemplate`](../../packages/codemod-utils-blueprints#api-process-template) from `@codemod-utils/blueprints` to tell the blueprint what we know and retrieve the resulting file.

```ts
import { processTemplate } from '@codemod-utils/blueprints';

// Store what we know in an object
const data = {
  // ...
};

const file = processTemplate(blueprintFile, data);
```

Update the `create-files-from-blueprints` step so that blueprints know which names and locations to use.

<details>

<summary>Solution</summary>

::: code-group

```diff [src/steps/create-files-from-blueprints.ts]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

+ import { processTemplate } from '@codemod-utils/blueprints';
import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';
import { blueprintsRoot } from '../utils/blueprints.js';

export function createFilesFromBlueprints(options: Options): void {
  const blueprintFilePaths = findFiles('**/*', {
    projectRoot: blueprintsRoot,
  });

  const fileMap = new Map(
    blueprintFilePaths.map((blueprintFilePath) => {
      const blueprintFile = readFileSync(
        join(blueprintsRoot, blueprintFilePath),
        'utf8',
      );

+       const file = processTemplate(blueprintFile, {
+         options,
+       });
+
-       return [blueprintFilePath, blueprintFile];
+       return [blueprintFilePath, file];
    }),
  );

  createFiles(fileMap, options);
}
```

:::

</details>


## Add delimiters

Next, we use [delimiters](https://lodash.com/docs/#template) (placeholders) to embed logic in a blueprint. `processTemplate` supports 3 types of delimiters, [the same used by Ember CLI](https://github.com/ember-cli/ember-cli/blob/v0.6.2-%40ember-tooling/blueprint-model/packages/blueprint-model/utilities/process-template.js):

- Escape (`<%- %>`) - escape an HTML code
- Evaluate (`<% %>`) - evaluate a JavaScript code (e.g. conditionals, loops)
- Interpolate (`<%= %>`) - substitute a value (string interpolations)

We can use the interpolate delimiter so that the addon's `package.json` shows the correct addon name.

::: code-group

```diff [src/blueprints/__addonLocation__/package.json]
{
-   "name": "addon-1",
+   "name": "<%= options.addon.name %>",
  "version": "0.0.0"
}
```

:::

> [!IMPORTANT]
> 
> The delimiter refers to the name `options`. This name matches the key that we had used when passing `options` to `processTemplate`.


Now your turn. Update the blueprint for the test app.

<details>

<summary>Solution</summary>

::: code-group

```diff [src/blueprints/__testAppLocation__/package.json]
{
-   "name": "test-app-for-addon-1",
+   "name": "<%= options.testApp.name %>",
  "version": "0.0.0"
}
```

:::

</details>

> [!TIP]
>
> It's easy to miscalculate data and misplace the newline character `\n` (`\r\n` on Windows) in blueprints with delimiters. Run `update-test-fixtures.sh` as a sanity check.


## Resolve file paths

The file map that we passed to `createFiles` still uses the blueprint file path.

```ts
const fileMap = new Map(
  blueprintFilePaths.map((blueprintFilePath) => {
    const blueprintFile = ...

    const file = ...

    return [blueprintFilePath, file];
  }),
);
```

Since the blueprint for the addon's `package.json` lives in the folder `__addonLocation__`, the resulting file will also appear in `__addonLocation__`.

```sh {:no-line-numbers}
workspace-root
├── __addonLocation__
│   └── package.json
└── __testAppLocation__
    └── package.json
```

We want the file to be in `options.addon.location` instead. Let's write a function called `resolveBlueprintFilePath`. It is to replace the placeholder `'__addonLocation__'` with `options.addon.location`.

::: code-group

```diff [src/steps/create-files-from-blueprints.ts]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { processTemplate } from '@codemod-utils/blueprints';
import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';
import { blueprintsRoot } from '../utils/blueprints.js';

+ function resolveBlueprintFilePath(
+   blueprintFilePath: string,
+   options: Options,
+ ): string {
+   const { addon } = options;
+ 
+   return blueprintFilePath.replace('__addonLocation__', addon.location);
+ }
+
export function createFilesFromBlueprints(options: Options): void {
  const blueprintFilePaths = findFiles('**/*', {
    projectRoot: blueprintsRoot,
  });

  const fileMap = new Map(
    blueprintFilePaths.map((blueprintFilePath) => {
+       const filePath = resolveBlueprintFilePath(blueprintFilePath, options);
+
      const blueprintFile = readFileSync(
        join(blueprintsRoot, blueprintFilePath),
        'utf8',
      );

      const file = processTemplate(blueprintFile, {
        options,
      });

-       return [blueprintFilePath, file];
+       return [filePath, file];
    }),
  );

  createFiles(fileMap, options);
}
```

:::

Update `resolveBlueprintFilePath` so that it can also replace `'__testAppLocation__'` with `options.testApp.location`.

<details>

<summary>Solution</summary>

::: code-group

```diff [src/steps/create-files-from-blueprints.ts]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { processTemplate } from '@codemod-utils/blueprints';
import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';
import { blueprintsRoot } from '../utils/blueprints.js';

function resolveBlueprintFilePath(
  blueprintFilePath: string,
  options: Options,
): string {
-   const { addon } = options;
+   const { addon, testApp } = options;

-   return blueprintFilePath.replace('__addonLocation__', addon.location);
+   return blueprintFilePath
+     .replace('__addonLocation__', addon.location)
+     .replace('__testAppLocation__', testApp.location);
}

export function createFilesFromBlueprints(options: Options): void {
  const blueprintFilePaths = findFiles('**/*', {
    projectRoot: blueprintsRoot,
  });

  const fileMap = new Map(
    blueprintFilePaths.map((blueprintFilePath) => {
      const filePath = resolveBlueprintFilePath(blueprintFilePath, options);

      const blueprintFile = readFileSync(
        join(blueprintsRoot, blueprintFilePath),
        'utf8',
      );

      const file = processTemplate(blueprintFile, {
        options,
      });

      return [filePath, file];
    }),
  );

  createFiles(fileMap, options);
}
```

:::

</details>

Run `update-test-fixtures.sh` once more to see `package.json`'s in the correct place.

```sh {:no-line-numbers}
workspace-root
├── packages
│   └── ui
│       └── button
│           └── package.json
└── tests
    └── ui
        └── button
            └── package.json
```

> [!WARNING]
>
> Blueprint files can fail to exist when the codemod is published. (The codemod's tests pass locally and in CI, of course.) This can happen for files like `.gitignore` and `.npmignore`.
> 
> For such files, we can give the blueprint files a different name, e.g. `__gitignore__` and `__npmignore__`. Then, we tell `resolveBlueprintFilePath` to rename the blueprints at runtime.
>
> ```ts {9-10}
> function resolveBlueprintFilePath(
>   blueprintFilePath: string,
>   options: Options,
> ): string {
>   const { addon, testApp } = options;
> 
>   return blueprintFilePath
>     .replace('__addonLocation__', addon.location)
>     .replace('__gitignore__', '.gitignore')
>     .replace('__npmignore__', '.npmignore')
>     .replace('__testAppLocation__', testApp.location);
> }
> ```
>
> You can run `pnpm publish --dry-run` to check whether all blueprints exist like you expect.
>
> ```sh {:no-line-numbers}
> npm notice 911B  dist/bin/create-v2-addon-repo.js
> npm notice 145B  dist/src/blueprints/__addonLocation__/__gitignore__
> npm notice 109B  dist/src/blueprints/__addonLocation__/.eslintignore
> npm notice 340B  dist/src/blueprints/__addonLocation__/.eslintrc.js
> ...
> ```
