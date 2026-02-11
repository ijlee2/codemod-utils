# Create static files

Our version of `create-v2-addon-repo` will create a [workspace](https://pnpm.io/workspaces), where each addon has a corresponding test app. End-developers can expect their project to look like this:

```sh {:no-line-numbers}
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

We learned in [the previous chapter](./01-create-a-project) that,

- The `src/blueprints` folder contains blueprint files. We can use blueprints to create files that our end-developers want.
- `blueprintsRoot` represents where the blueprint files will be saved upon install.

Let's look at how to create files from blueprints.

Goals:

- Take small steps
- Read and write blueprint files


## Add blueprints

As mentioned in [Introduction](./00-introduction), we'll create just one file (`package.json`) in each addon and test app. In this chapter, this file will be **static** (the file content is always the same). There's nothing **dynamic** (e.g. string interpolations, conditional statements, loops) that would make our first step complex.

Create these files in `/src/blueprints`.

::: code-group

```json [src/blueprints/__addonLocation__/package.json]
{
  "name": "addon-1",
  "version": "0.0.0"
}
```

```json [src/blueprints/__testAppLocation__/package.json]
{
  "name": "test-app-for-addon-1",
  "version": "0.0.0"
}
```

:::

> [!IMPORTANT]
> 
> Placeholders in a file path should have an identifier that seldom occurs in real life. The examples above show two underscores (`__`), one before and one after the name of the variable that we'll use in the source code.

Then, scaffold a step called `create-files-from-blueprints`. Use `findFiles` from `@codemod-utils/files` to find the blueprint files and log their file paths.

> [!TIP]
>
> See the [main tutorial](../main-tutorial/04-update-acceptance-tests-part-1#take-small-steps-find-files) for a refresher on `findFiles`. Don't forget to run tests to check progress.
>
> ```sh {:no-line-numbers}
> ❯ pnpm test
> 
> [
>   '__addonLocation__/package.json',
>   '__testAppLocation__/package.json'
> ]
> ```

<details>

<summary>Solution</summary>

We must set `projectRoot` to `blueprintsRoot` (not `options.projectRoot`) when calling `findFiles`.

::: code-group

```diff [src/index.ts]
- import { createOptions } from './steps/index.js';
+ import { createFilesFromBlueprints, createOptions } from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

-   // ...
+   createFilesFromBlueprints(options);
}
```

```ts [src/steps/create-files-from-blueprints.ts]{7-9}
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

```diff [src/steps/index.ts]
+ export * from './create-files-from-blueprints.js';
export * from './create-options.js';
```

:::

</details>


## Read and write blueprints

Unlike in the [main tutorial](../main-tutorial/04-update-acceptance-tests-part-1#take-small-steps-read-and-write-files), we won't use `writeFileSync` to create files from blueprints. The reason is, the folders `__addonLocation__` and `__testAppLocation__` don't exist yet on an end-developer's machine. We would need to write boilerplate code to create these folders first and more code to handle possible runtime errors.

`@codemod-utils/files` provides [`createFiles`](https://github.com/ijlee2/codemod-utils/tree/main/packages/files/README.md#createfiles), which creates missing folders as needed. We just need to provide a `Map`, which maps a file's path to its content.

::: code-group

```ts [Example]
import { createFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

export function createLicenseAndReadme(options: Options): void {
  const fileMap = new Map([
    ['LICENSE.md', 'The MIT License (MIT)'],
    ['README.md', '# addon-1'],
  ]);

  createFiles(fileMap, options);
}
```

:::

Use the example above to update the `create-files-from-blueprints` step.

<details>

<summary>Solution</summary>

::: code-group

```diff [src/steps/create-files-from-blueprints.ts]
+ import { readFileSync } from 'node:fs';
+ import { join } from 'node:path';
+
- import { findFiles } from '@codemod-utils/files';
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

:::

</details>

Finally, let's check that our implementation is correct. Run `update-test-fixtures.sh`, then find the `output` folder for the fixture project named `sample-project`. You will see that we're already a few steps closer to creating the addon and the test app. ✨

```sh {:no-line-numbers}
workspace-root
├── __addonLocation__
│   └── package.json
└── __testAppLocation__
    └── package.json
```
