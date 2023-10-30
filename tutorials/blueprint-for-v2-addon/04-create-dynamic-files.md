# Create dynamic files

The blueprint files that we wrote in [Chapter 2](./02-create-static-files.md) are static: Regardless of the user's options, we always create the same file at the same place.

In this chapter, we'll create the files dynamically: The addon's `package.json` will display `options.addon.name` instead of `addon-1`, and will live in `options.addon.location`. The same change will take place for the test app's `package.json`.

Goals:

- Pass data
- Add delimiters
- Resolve file paths


## Pass data

Often, blueprints need context: If some condition is true, a file should be generated in a different way. To get the resulting file, we pass the blueprint and the things that we know to [`processTemplate()`](../../packages/blueprints#processtemplate).

```ts
import { processTemplate } from '@codemod-utils/blueprints';

// Store what we know in an object
const data = {
  // ...
};

const file = processTemplate(blueprintFile, data);
```

Update the `create-files-from-blueprints` step so that it processes the blueprint files. How will you pass the names and locations of the addon and test app?

<details>

<summary>Solution: <code>src/steps/create-files-from-blueprints.ts</code></summary>

```diff
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

-       return [blueprintFilePath, blueprintFile];
+       const file = processTemplate(blueprintFile, {
+         options,
+       });
+
+       return [blueprintFilePath, file];
    }),
  );

  createFiles(fileMap, options);
}
```

</details>


## Add delimiters

Next, we use [delimiters](https://lodash.com/docs/#template) (think of these as a placeholder) to embed logic in a blueprint file. `processTemplate()` supports 3 types of delimiters and asks for [the same syntax as Ember.js](https://github.com/ember-cli/ember-cli/blob/v5.3.0/lib/utilities/process-template.js).

- Escape (`<%- %>`) - escape an HTML code
- Evaluate (`<% %>`) - evaluate a JavaScript code (e.g. conditionals, loops)
- Interpolate (`<%= %>`) - substitute a value (string interpolations)

For example, we can use the interpolate delimiter so that the addon's `package.json` shows the user-defined addon name.

<details>

<summary><code>src/blueprints/__addonLocation__/package.json</code></summary>

Since we passed `options` to the data object, the addon name can be found in `options.addon.name`.

```diff
{
-   "name": "addon-1",
+   "name": "<%= options.addon.name %>",
  "version": "0.0.0"
}
```

</details>

Now your turn. Update the blueprint for the test app's `package.json`.

<details>

<summary>Solution: <code>src/blueprints/__testAppLocation__/package.json</code></summary>

```diff
{
-   "name": "test-app-for-addon-1",
+   "name": "<%= options.testApp.name %>",
  "version": "0.0.0"
}
```

</details>

> [!NOTE]
> Often, it is easy to miscalculate data and misplace the newline character `\n` . You can run `./codemod-test-fixtures.sh` to check if the fixture files are updated correctly.


## Resolve file paths

Currently, the file map that we passed to `createFiles()` uses the blueprint file path.

```ts
const fileMap = new Map(
  blueprintFilePaths.map((blueprintFilePath) => {
    const blueprintFile = ...

    const file = ...

    return [blueprintFilePath, file];
  }),
);
```

As a consequence, because the blueprint for the addon's `package.json` lives in a folder named `__addonLocation__`, the resulting file will also appear in `__addonLocation__`. We want the file to be in `options.addon.location` instead.

```sh
workspace-root
├── __addonLocation__
│   └── package.json
└── __testAppLocation__
    └── package.json
```

To fix this issue, we can write a function called `resolveBlueprintFilePath()`. It replaces the placeholder `__addonLocation__` with `options.addon.location`.

<details>

<summary><code>src/steps/create-files-from-blueprints.ts</code></summary>

```diff
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

</details>

Update `resolveBlueprintFilePath()` so that it replaces `__testAppLocation__` with the user-defined test-app location.

<details>

<summary><code>src/steps/create-files-from-blueprints.ts</code></summary>

```diff
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

</details>

Run `./codemod-test-fixtures.sh` once more to see the `package.json`'s in the right place.

```sh
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

> [!IMPORTANT]
> To create `.gitignore` and `.npmignore` via blueprints, the blueprint files must be named differently, e.g. `__gitignore__` and `__npmignore__`. Otherwise, these files will be missing in `src/blueprints` when the codemod is published.
>
> Afterwards, you can update `resolveBlueprintFilePath()` to handle `.gitignore` and `.npmignore`.
>
> ```diff
> function resolveBlueprintFilePath(
>   blueprintFilePath: string,
>   options: Options,
> ): string {
>   const { addon, testApp } = options;
> 
>   return blueprintFilePath
>     .replace('__addonLocation__', addon.location)
> +     .replace('__gitignore__', '.gitignore')
> +     .replace('__npmignore__', '.npmignore')
>     .replace('__testAppLocation__', testApp.location);
> }
> ```


<div align="center">
  <div>
    Next: Conclusion
  </div>
  <div>
    Previous: <a href="./03-define-options.md">Define options</a>
  </div>
</div>
