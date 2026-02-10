# Step 1: Update acceptance tests (Part 1)

So far, we used the [CLI to scaffold a project](./01-create-a-project.md) and wrote down [3 steps to rename test modules](./03-sketch-out-the-solution.md):

- Update acceptance tests
- Update integration tests
- Update unit tests

Let's implement the first step so that we can understand better how to write codemods.

Goals:

- Take small steps
- Add a fixture project
- Read and write files


## Add a fixture project

In the early stage of development, I recommend creating a fixture project for acceptance testing. Ideally, the fixture comes from a real-life project (copy-paste) or is modeled after it.

For this tutorial, please cherry-pick the commit `chore: Added a fixture project` from [my solution repo](https://github.com/ijlee2/ember-codemod-rename-test-modules/commits/main).

```sh
git remote add solution git@github.com:ijlee2/ember-codemod-rename-test-modules.git
git fetch solution
git cherry-pick 92a8126
git remote remove solution
```

Have a look at the files in `tests/fixtures/sample-project/input` ("input project"). You will see that the test module names are quite inconsistent. The files in `tests/fixtures/sample-project/output` ("output project") are the same as those in the input project.

Since our codemod is currently a no-op and the input and output are the same, we expect the `test` script to pass. Indeed, this is the case.

<details>

You can ignore the error message, which came from compiling TypeScript.

<summary>Expected output</summary>

```sh
❯ pnpm test

src/index.ts:5:9 - error TS6133: 'options' is declared but its value is never read.

5   const options = createOptions(codemodOptions);
          ~~~~~~~

Found 1 error in src/index.ts:5

SUCCESS: Built dist-for-testing.

running 2 tests
..
test result: ok. 2 passed; 0 failed; 0 ignored; 0 filtered out; finished in 188ms
```

</details>


## Take small steps

We'll now create a step called `rename-acceptance-tests`. By the end of this chapter, we'll be able to read files from an input project, then write back (without altering the file content) to create the output project.

Don't forget to practice running `lint`, `lint:fix`, and `test`.


### Export an empty function

In the `src/steps` folder, create a file called `rename-acceptance-tests.ts`.

1. The file exports an empty function named `renameAcceptanceTests()` (camelized).
1. The function receives 1 argument, `options`.
1. The type definition for `options` can be found in `../types/index.js`.

<details>

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

```ts
import type { Options } from '../types/index.js';

export function renameAcceptanceTests(options: Options): void {
  // ...
}
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

Next, we find files that are of interest to the `rename-acceptance-tests` step. `@codemod-utils/files` provides a method called `findFiles()`. We need to fill out 2 search criteria:

- A **glob pattern** (how to find files)
- The location of the end-developer's project (where to find files)

Thanks to Ember's conventions, we know that acceptance tests live in the folder `tests/acceptance`, the file names end in `-test`, and the file extensions are either `.js` or `.ts`. The glob pattern that captures our knowledge is `tests/acceptance/**/*-test.{js,ts}`.

The project's location comes from `options.projectRoot`. I recommend destructuring `options`, then passing a new object with exactly what is needed to `findFiles()`.

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

Note, `renameAcceptanceTests()` logs `filePaths` in the console. You can run the `test` script to check its value.

<details>

<summary>Expected output</summary>

Note, the array appears twice, because an acceptance test runs the codemod twice to assert idempotence.

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

Now that we know which files exist in the end-developer's project, we can read and update their content. To do so, we can use methods from Node.js: [`join()`](https://nodejs.org/docs/latest-v18.x/api/path.html#pathjoinpaths), [`readFileSync()`](https://nodejs.org/docs/latest-v18.x/api/fs.html#fsreadfilesyncpath-options), and [`writeFileSync()`](https://nodejs.org/docs/latest-v18.x/api/fs.html#fswritefilesyncfile-data-options).

See if you can do a for-loop over `filePaths`. For each file path,

1. Use `join()` to form the absolute file path.
1. Use `readFileSync()` to read the file content (with encoding of `'utf8'`).
1. Use `writeFileSync()` to write the content back to the file (with encoding of `'utf8'`).

In short, `renameAcceptanceTests()` is now an **identity function** (a type of no-op). The `test` script should continue to pass, since we haven't really changed the test files.

<details>

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

```diff
+ import { readFileSync, writeFileSync } from 'node:fs';
+ import { join } from 'node:path';
+ 
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

doesn't make our (future) intent clear. It may also encourage us to add some complex code inside the for-loop.

To avoid nesting code and to clearly indicate what this line is about, let's extract a function called `renameModule()`. It receives the file content as input and returns it back.

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
+ 
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
    Next: <a href="./05-step-1-update-acceptance-tests-part-2.md">Step 1: Update acceptance tests (Part 2)</a>
  </div>
  <div>
    Previous: <a href="./03-sketch-out-the-solution.md">Sketch out the solution</a>
  </div>
</div>
