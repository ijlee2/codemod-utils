# Create static files

Our codemod will support **workspaces**. For us, this means, a project that includes 1 addon and 1 test app, or many addons and equally many test apps.

```sh
workspace-root
├── packages
│   ├── addon-1
│   ├── ...
│   └── addon-n
└── tests
    ├── test-app-for-addon-1
    ├── ...
    └── test-app-for-addon-n
```

We learned in [the previous chapter](./01-create-a-project.md) that,

- The `blueprints` folder contains blueprint files, which we use to create files that our end-developers (users) will have.
- The `blueprintsRoot` variable represents where the blueprint files will be saved on their machine.

Let's look at how we can create files from `blueprints`.

Goals:

- Take small steps
- Read and write blueprint files


## Add blueprint files

We'll start by creating 1 file for the addon and 1 file for the test app. Both files are **static** (the file content never changes). In other words, there's nothing **dynamic** (e.g. string interpolations, conditional statements, for-loops) that would make the first step complex.

Copy-paste the following starter code:

<details>

<summary><code>src/blueprints/__addonLocation__/package.json</code></summary>

```json
{
  "name": "addon-1",
  "version": "0.0.0"
}
```

</details>

<details>

<summary><code>src/blueprints/__testAppLocation__/package.json</code></summary>

```json
{
  "name": "test-app-for-addon-1",
  "version": "0.0.0"
}
```

</details>

Then, scaffold a step called `create-files-from-blueprints`. Use `findFiles()` from `@codemod-utils/files` to find the blueprint files, then log the file paths.

> [!NOTE]
> Need a refresher on [`findFiles()`](../main-tutorial/04-step-1-update-acceptance-tests-part-1.md#find-files)? Don't forget to run tests to check your code.
>
> ```sh
> ❯ pnpm test
> 
> [
>   '__addonLocation__/package.json',
>   '__testAppLocation__/package.json'
> ]
> ```

<details>

<summary>Solution: <code>src/steps/create-files-from-blueprints.ts</code></summary>

Note, the project root for `findFiles()` points to `blueprintsRoot`, not `options.projectRoot`.

```ts
import { findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';
import { blueprintsRoot } from '../utils/blueprints.js';

export function createFilesFromBlueprints(options: Options): void {
  const blueprintFilePaths = findFiles('**/*', {
    projectRoot: blueprintsRoot,
  });

  console.log(blueprintFilePaths);
}
```

</details>

<details>

<summary>Solution: <code>src/steps/index.ts</code></summary>

```diff
+ export * from './create-files-from-blueprints.js';
export * from './create-options.js';
```

</details>

<details>

<summary>Solution: <code>src/index.ts</code></summary>

```diff
- import { createOptions } from './steps/index.js';
+ import { createFilesFromBlueprints, createOptions } from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

-   // ...
+   createFilesFromBlueprints(options);
}
```

</details>


## Read and write blueprint files

Unlike in [the main tutorial](../main-tutorial/04-step-1-update-acceptance-tests-part-1.md#read-and-write-files), we won't use `writeFileSync()` from Node.js to create files. The reason is, the folders where files will be created (i.e. folders named `__addonLocation__` and `__testAppLocation__`) don't exist on the user's machine.

Luckily, `@codemod-utils/files` provides [`createFiles()`](../../packages/files/README.md#createfiles), which creates missing folders as needed. We just need to provide this function a `Map`, which maps a blueprint's file path to its file content.

<details>

<summary>Solution: <code>src/steps/create-files-from-blueprints.ts</code></summary>

```diff
- import { findFiles } from '@codemod-utils/files';
+ import { readFileSync } from 'node:fs';
+ import { join } from 'node:path';
+
+ import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';
import { blueprintsRoot } from '../utils/blueprints.js';

export function createFilesFromBlueprints(options: Options): void {
  const blueprintFilePaths = findFiles('**/*', {
    projectRoot: blueprintsRoot,
  });

-   console.log(blueprintFilePaths);
+   const fileMap = new Map(
+     blueprintFilePaths.map((blueprintFilePath) => {
+       const blueprintFile = readFileSync(
+         join(blueprintsRoot, blueprintFilePath),
+         'utf8',
+       );
+ 
+       return [blueprintFilePath, blueprintFile];
+     }),
+   );
+ 
+   createFiles(fileMap, options);
}
```

</details>

To see the effect of `create-files-from-blueprints`, run `./update-test-fixtures.sh`, then check the `sample-project`'s `output` folder. You will see that we're already a few steps closer to creating the addon and the test app. ✨

```sh
workspace-root
├── __addonLocation__
│   └── package.json
└── __testAppLocation__
    └── package.json
```


<div align="center">
  <div>
    Next: <a href="./03-define-options.md">Define options</a>
  </div>
  <div>
    Previous: <a href="./01-create-a-project.md">Create a project</a>
  </div>
</div>
