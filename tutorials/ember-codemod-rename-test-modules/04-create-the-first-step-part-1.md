# Create the first step (Part 1)

So far, we used the CLI to [scaffold a project](./01-create-a-project.md) and came up with [3 steps to make test module names consistent](./03-sketch-out-the-solution.md):

- Update acceptance tests
- Update integration tests
- Update unit tests

Let's implement the first step so that we can understand better how to write codemods.

Goals:

- Take small steps
- Add a fixture project
- Read and write files


## Remove the sample step

The CLI added a step called `add-end-of-line`, which our codemod doesn't need. Let's find and remove the related code. (This happens to be a refactoring technique, called "remove dead code.")

Files to delete:

- `src/steps/add-end-of-line.ts`
- `tests/steps/add-end-of-line/base-case.test.ts`
- `tests/steps/add-end-of-line/edge-case-file-ends-with-newline.test.ts`
- `tests/steps/add-end-of-line/edge-case-file-is-empty.test.ts`

Files to update:

<details>

<summary>Solution: <code>src/steps/index.ts</code></summary>

```diff
- export * from './add-end-of-line.js';
export * from './create-options.js';
```

</details>

<details>

<summary>Solution: <code>src/index.ts</code></summary>

```diff
- import { addEndOfLine, createOptions } from './steps/index.js';
+ import { createOptions } from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

-   // TODO: Replace with actual steps
-   addEndOfLine(options);
+   // ...
}
```

</details>

The `lint` script fails with 1 error (`options` in `src/index.ts` is unused), but the `test` script continues to pass.


## Add a fixture project

At the early stage of development, I recommend creating a fixture project for acceptance testing. Ideally, the fixture comes from a real-life project (copy-paste) or is modeled after it.

For this tutorial, you can cherry-pick [the 3rd commit from my solution repo](https://github.com/ijlee2/ember-codemod-rename-test-modules/commits/main):

```sh
git remote add solution git@github.com:ijlee2/ember-codemod-rename-test-modules.git
git fetch solution
git cherry-pick 5a354a4
git remote remove solution
```

Have a look at the files in `tests/fixtures/sample-project/input` ("input project"). You will find that the test module names are wildly inconsistent. The files in `tests/fixtures/sample-project/output` ("output project") are, for now, the same as those from the input project.

Since our codemod is a no-op and the input and output are the same, we expect the `test` script to pass. Indeed, this is the case.


## Take small steps

We'll create a step called `rename-acceptance-tests`. By the end of this chapter, we'll be able to read files from an input project, then write back (without altering the file content) to create the output project.

Don't forget to practice running `lint`, `lint:fix`, and `test`.


### Scaffold the step

In the `src/steps` folder, create a file called `rename-acceptance-tests.ts`. The file exports a function that is named `renameAcceptanceTests` (camelized) and receives `options` as an argument.

<details>

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

```diff
+ import type { Options } from '../types/index.js';
+ 
+ export function renameAcceptanceTests(options: Options): void {
+   // ...
+ }
```

</details>

Then, re-export the function in `src/steps/index.ts` and call it from `src/index.ts`:

<details>

<summary>Solution: <code>src/steps/index.ts</code></summary>

```diff
export * from './create-options.js';
+ export * from './rename-acceptance-tests.js';
```

</details>

<details>

<summary>Solution: <code>src/index.ts</code></summary>

```diff
- import { createOptions } from './steps/index.js';
+ import { createOptions, renameAcceptanceTests } from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

-   // ...
+   renameAcceptanceTests(options);
}

```

</details>


### Find files

Next, we find the right files for the `rename-acceptance-tests` step.

`@codemod-utils/files` provides a method called `findFiles()`. We just need to fill out 2 search criteria:

- A **glob pattern** (how to find files)
- The location of the end-developer's project (where to find files)

Thanks to Ember's conventions, we know that acceptance tests live in the folder `tests/acceptance`, the file names end in `-test`, and the file extensions are either `.js` or `.ts`. The glob pattern that describes what we know is `tests/acceptance/**/*-test.{js,ts}`.

The project's location comes from `options.projectRoot`. I strongly recommend destructuring `options`, then passing exactly what is needed to `findFiles()`.

<details>

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

```diff
+ import { findFiles } from '@codemod-utils/files';
+ 
import type { Options } from '../types/index.js';

export function renameAcceptanceTests(options: Options): void {
-   // ...
+   const { projectRoot } = options;
+ 
+   const filePaths = findFiles('tests/acceptance/**/*-test.{js,ts}', {
+     projectRoot,
+   });
+ 
+   console.log(filePaths);
}
```

</details>

Note how I logged `filePaths` to check what `findFiles()` returns. You can run the `test` script to see the output.

<details>

<summary>Expected output</summary>

Note, the array appears twice, because an acceptance test runs the codemod twice to assert idempotency.

```sh
❯ pnpm test

[
  'tests/acceptance/form-test.ts',
  'tests/acceptance/index-test.ts',
  'tests/acceptance/product-details-test.js',
  'tests/acceptance/products-test.js',
  'tests/acceptance/products/product-test.js'
]
```

</details>

You can also check that `lint` is passing.


### Read and write files

Now that we know which files exist in the end-consumer's project, we can read them and update their content.

Note, Node.js provides [`readFileSync()`](https://nodejs.org/docs/latest-v16.x/api/fs.html#fsreadfilesyncpath-options) and [`writeFileSync()`](https://nodejs.org/docs/latest-v16.x/api/fs.html#fswritefilesyncfile-data-options). We can also use its [`join()`](https://nodejs.org/docs/latest-v16.x/api/path.html#pathjoinpaths) method to form the absolute file path.

See if you can do a for-loop over `filePaths`. For each file path:

1. Use `join()` to form the absolute file path.
1. Use `readFileSync()` to read the file content.
1. Use `writeFileSync()` to write the content back to the file (a no-op).

The `test` script should continue to pass.

<details>

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

```diff
+ import { readFileSync, writeFileSync } from 'node:fs';
+ import { join } from 'node:path';

import { findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

export function renameAcceptanceTests(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('tests/acceptance/**/*-test.{js,ts}', {
    projectRoot,
  });

-   console.log(filePaths);
+   filePaths.forEach((filePath) => {
+     const oldPath = join(projectRoot, filePath);
+     const oldFile = readFileSync(oldPath, 'utf8');
+ 
+     const newFile = oldFile;
+ 
+     writeFileSync(oldPath, newFile, 'utf8');
+   });
}
```

</details>


## Extract function

The line,

```ts
const newFile = oldFile;
```

may encourage our future self to add some complex code inside the for-loop.

To avoid nesting code and to better indicate what this line is actually about, let's extract a function called `renameModule`. It receives the file content as input, and returns it as output (a no-op).

<details>

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

+ function renameModule(file: string): string {
+   return file;
+ }

export function renameAcceptanceTests(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('tests/acceptance/**/*-test.{js,ts}', {
    projectRoot,
  });

  filePaths.forEach((filePath) => {
    const oldPath = join(projectRoot, filePath);
    const oldFile = readFileSync(oldPath, 'utf8');

-     const newFile = oldFile;
+     const newFile = renameModule(oldFile);

    writeFileSync(oldPath, newFile, 'utf8');
  });
}
```

</details>


<div align="center">
  <div>
    Next: <a href="./05-create-the-first-step-part-1.md">Create the first step (Part 2)</a>
  </div>
  <div>
    Previous: <a href="./03-sketch-out-the-solution.md">Sketch out the solution</a>
  </div>
</div>
