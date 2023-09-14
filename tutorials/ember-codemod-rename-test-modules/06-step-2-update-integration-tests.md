# Step 2: Update integration tests

Now that we have a way to update acceptance tests, we expect that we can update integration tests in a similar manner. But how much code that we copy-paste will "just work"? Should we extract utility functions to avoid code duplication?

It's hard to answer these questions, because we're still learning how to write codemods. Furthermore, integration tests have 3 subcases (components, helpers, and modifiers) instead of one.

Let's discover the answers by implementing the step, step-by-step.

Goals:

- Learn by repetition
- Prefer duplication over premature abstraction
- Go with simple


## Take small steps (again)

We'll create a step called `rename-integration-tests`. Now that we have some experience, we can take larger small steps.


### Scaffold the step

In [Chapter 4](04-step-1-update-acceptance-tests-part-1.md#take-small-steps), we scaffolded (partially implemented) `rename-acceptance-tests` by taking 4 steps:

1. Export an empty function.
1. Find files.
1. Read and write files (identity function).
1. Extract the function `renameModule()`.

See if you can similarly scaffold `rename-integration-tests`. Feel free to look back at the chapter.

<details>

<summary>Solution: <code>src/steps/rename-integration-tests.ts</code></summary>

```ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

function renameModule(file: string): string {
  return file;
}

export function renameIntegrationTests(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('tests/integration/**/*-test.{js,ts}', {
    projectRoot,
  });

  filePaths.forEach((filePath) => {
    const oldPath = join(projectRoot, filePath);
    const oldFile = readFileSync(oldPath, 'utf8');

    const newFile = renameModule(oldFile);

    writeFileSync(oldPath, newFile, 'utf8');
  });
}
```

</details>

<details>

<summary>Solution: <code>src/steps/index.ts</code></summary>

```diff
export * from './create-options.js';
export * from './rename-acceptance-tests.js';
+ export * from './rename-integration-tests.js';
```

</details>

<details>

<summary>Solution: <code>src/index.ts</code></summary>

```diff
- import { createOptions, renameAcceptanceTests } from './steps/index.js';
+ import {
+   createOptions,
+   renameAcceptanceTests,
+   renameIntegrationTests,
+ } from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

  renameAcceptanceTests(options);
+   renameIntegrationTests(options);
}
```

</details>

Don't forget to check that `lint` and `test` pass.


### Transform code

In [Chapter 5](./05-step-1-update-acceptance-tests-part-2.md), we used AST Explorer to try out ideas, then moved the implementation to our codemod. We ended up with two functions, `getModuleName()` and `renameModule()`.

<details>

<summary>Starter code</summary>

```ts
type Data = {
  isTypeScript: boolean;
  moduleName: string;
};

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = dir.replace(/^tests\/acceptance(\/)?/, '');
  name = name.replace(/-test$/, '');

  const entityName = join(dir, name);

  // a.k.a. friendlyTestDescription
  return ['Acceptance', entityName].join(' | ');
}

function renameModule(file: string, data: Data): string {
  const traverse = AST.traverse(data.isTypeScript);

  const ast = traverse(file, {
    visitCallExpression(node) {
      if (
        node.value.callee.type !== 'Identifier' ||
        node.value.callee.name !== 'module'
      ) {
        return false;
      }

      if (node.value.arguments.length !== 2) {
        return false;
      }

      switch (node.value.arguments[0].type) {
        case 'Literal': {
          node.value.arguments[0] = AST.builders.literal(data.moduleName);

          break;
        }

        case 'StringLiteral': {
          node.value.arguments[0] = AST.builders.stringLiteral(data.moduleName);

          break;
        }
      }

      return false;
    },
  });

  return AST.print(ast);
}
```

</details>

Try copy-pasting the starter code to `rename-integration-tests`, then remove references to acceptance tests.

<details>

<summary>Solution: <code>src/steps/rename-integration-tests.ts</code></summary>

I highlighted only how `getModuleName()` and `renameModule()` differ between `rename-acceptance-tests` and `rename-integration-tests`.

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { AST } from '@codemod-utils/ast-javascript';
import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

type Data = {
  isTypeScript: boolean;
  moduleName: string;
};

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

-   dir = dir.replace(/^tests\/acceptance(\/)?/, '');
+   dir = dir.replace(/^tests\/integration(\/)?/, '');
  name = name.replace(/-test$/, '');

  const entityName = join(dir, name);

  // a.k.a. friendlyTestDescription
-   return ['Acceptance', entityName].join(' | ');
+   return ['Integration', entityName].join(' | ');
}

function renameModule(file: string, data: Data): string {
  const traverse = AST.traverse(data.isTypeScript);

  const ast = traverse(file, {
    visitCallExpression(node) {
      if (
        node.value.callee.type !== 'Identifier' ||
        node.value.callee.name !== 'module'
      ) {
        return false;
      }

      if (node.value.arguments.length !== 2) {
        return false;
      }

      switch (node.value.arguments[0].type) {
        case 'Literal': {
          node.value.arguments[0] = AST.builders.literal(data.moduleName);

          break;
        }

        case 'StringLiteral': {
          node.value.arguments[0] = AST.builders.stringLiteral(data.moduleName);

          break;
        }
      }

      return false;
    },
  });

  return AST.print(ast);
}

export function renameIntegrationTests(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('tests/integration/**/*-test.{js,ts}', {
    projectRoot,
  });

  filePaths.forEach((filePath) => {
    const oldPath = join(projectRoot, filePath);
    const oldFile = readFileSync(oldPath, 'utf8');

    const data = {
      isTypeScript: filePath.endsWith('.ts'),
      moduleName: getModuleName(filePath),
    };

    const newFile = renameModule(oldFile, data);

    writeFileSync(oldPath, newFile, 'utf8');
  });
}
```

</details>

Let's run `test` to check the names of test modules.

<details>

<summary>Expected output</summary>

```sh
❯ pnpm test

failures:

---- index > sample-project message ----
AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
+ actual - expected ... Lines skipped

{
  '.gitkeep': '',
...
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('Integration | components/navigation-menu', function (hooks) {\n" +
-         "module('Integration | Component | <NavigationMenu>', function (hooks) {\n" +
        '  setupRenderingTest(hooks);\n' +
        '\n' +
...
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('Integration | components/products/product/card', function (hooks) {\n" +
-         "module('<Products::Product::Card>', function (hooks) {\n" +
        '  setupRenderingTest(hooks);\n' +
        '  setupIntl(hooks);\n' +
...
        "import sinon from 'sinon';\n" +
        '\n' +
+         "module('Integration | components/products/product/details', function (hooks) {\n" +
-         "module('Integration | Component | products | product | details', function (hooks) {\n" +
        '  setupRenderingTest(hooks);\n' +
        '  setupIntl(hooks);\n' +
...
```

</details>

From the "actual" lines (marked with `+`), we see that the codemod did update test module names, but the names are incorrect (they are not what Ember CLI would generate).

```ts
/* Actual: Module names don't include the entity type */
module('Integration | components/navigation-menu', function (hooks) {});
module('Integration | components/products/product/card', function (hooks) {});
module('Integration | components/products/product/details', function (hooks) {});
```

```ts
/* Expected: Module names include the entity type */
module('Integration | Component | navigation-menu', function (hooks) {});
module('Integration | Component | products/product/card', function (hooks) {});
module('Integration | Component | products/product/details', function (hooks) {});
```

We can conclude that `getModuleName()`, which worked for acceptance tests, failed to for integration tests. This illustrates why we want to avoid premature abstractions (e.g. by extracting utility functions early).

The good news is, `getModuleName()` got us quite far with implementing `rename-integration-tests`. We just need to figure out how to update the function.


## Correct overshoots

We say that an [iterative method](https://en.wikipedia.org/wiki/Iterative_method) has "overshot," if an iteration (another word for step) helped us reach somewhere close to the solution, but made us go a bit too far. An overshoot occurred when we copy-pasted `getModuleName()` from `rename-acceptance-tests`.

```ts
function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = dir.replace(/^tests\/integration(\/)?/, '');
  name = name.replace(/-test$/, '');

  const entityName = join(dir, name);

  // a.k.a. friendlyTestDescription
  return ['Integration', entityName].join(' | ');
}
```

Let's correct the overshoot by adding the entity type (here, we represent it as a string such as `'Component'`, `'Helper'`, or `'Modifier'`) before the entity name (e.g. `'navigation-menu'`, `'products/product/card'`).

```ts
function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = dir.replace(/^tests\/integration(\/)?/, '');
  name = name.replace(/-test$/, '');

  const entityType = /* ... */;
  const entityName = /* ... */;

  // a.k.a. friendlyTestDescription
  return ['Integration', entityType, entityName].join(' | ');
}
```


### Go with simple

The code for `getModuleName()` shows a variable called `dir`. This variable holds a string that represents the test file's relative folder path, e.g. `'components'`, `'components/products/product'`, and `'modifiers'`.

You might see how we can derive the entity's type and name from `dir`.

```ts
import { join } from 'node:path';

function parseEntity(dir: string) {
  // ...
}

const { entityType, remainingPath } = parseEntity(dir);
const entityName = join(remainingPath, name);
```

Let me first show you the solution for `parseEntity()`, then explain the particular approach.

```ts
const folderToEntityType = new Map([
  ['components', 'Component'],
  ['helpers', 'Helper'],
  ['modifiers', 'Modifier'],
]);

function parseEntity(dir: string): {
  entityType: string | undefined;
  remainingPath: string;
} {
  const [folder, ...remainingPaths] = dir.split('/');
  const entityType = folderToEntityType.get(folder!);

  return {
    entityType,
    remainingPath: remainingPaths.join('/'),
  };
}
```

I hard-coded the mapping between folders and entity types, _despite_ knowing that Ember CLI pluralizes the entity type to name the folder. I didn't try to create a regular expression or install a package that has `singularize()` and `capitalize()`.

In short, I took the simplest approach to quickly implement a step. Later, after finishing writing the codemod and writing more tests, we can revisit the steps and come up with better approaches.

<details>

<summary>Solution: <code>src/steps/rename-integration-tests.ts</code></summary>

The implementations for `renameModule()` and `renameIntegrationTests()` remain unchanged and have been hidden for simplicity.

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { AST } from '@codemod-utils/ast-javascript';
import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

type Data = {
  isTypeScript: boolean;
  moduleName: string;
};

+ const folderToEntityType = new Map([
+   ['components', 'Component'],
+   ['helpers', 'Helper'],
+   ['modifiers', 'Modifier'],
+ ]);
+ 
+ function parseEntity(dir: string): {
+   entityType: string | undefined;
+   remainingPath: string;
+ } {
+   const [folder, ...remainingPaths] = dir.split('/');
+   const entityType = folderToEntityType.get(folder!);
+ 
+   return {
+     entityType,
+     remainingPath: remainingPaths.join('/'),
+   };
+ }
+ 
function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = dir.replace(/^tests\/integration(\/)?/, '');
  name = name.replace(/-test$/, '');

-   const entityName = join(dir, name);
+   const { entityType, remainingPath } = parseEntity(dir);
+   const entityName = join(remainingPath, name);

  // a.k.a. friendlyTestDescription
-   return ['Integration', entityName].join(' | ');
+   return ['Integration', entityType, entityName].join(' | ');
}

function renameModule(file: string, data: Data): string {
  // ...
}

export function renameIntegrationTests(options: Options): void {
  // ...
}
```

</details>

Run `test` once more to check the names of test modules. This time, we should see the names that Ember CLI gives when we generate an integration test.

<details>

<summary>Expected output</summary>

```sh
❯ pnpm test

failures:

---- index > sample-project message ----
AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
+ actual - expected ... Lines skipped

{
  '.gitkeep': '',
...
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('Integration | Component | navigation-menu', function (hooks) {\n" +
-         "module('Integration | Component | <NavigationMenu>', function (hooks) {\n" +
        '  setupRenderingTest(hooks);\n' +
        '\n' +
...
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('Integration | Component | products/product/card', function (hooks) {\n" +
-         "module('<Products::Product::Card>', function (hooks) {\n" +
        '  setupRenderingTest(hooks);\n' +
        '  setupIntl(hooks);\n' +
...
        "import sinon from 'sinon';\n" +
        '\n' +
+         "module('Integration | Component | products/product/details', function (hooks) {\n" +
-         "module('Integration | Component | products | product | details', function (hooks) {\n" +
        '  setupRenderingTest(hooks);\n' +
        '  setupIntl(hooks);\n' +
...
```

</details>

Now that we're satisfied, we can run `./codemod-test-fixtures.sh` to update the output fixture files.

(You might have noticed that I surreptitiously ignored what would happen when `entityType` is `undefined`. We will address this edge case in [Chapter 8](./08-refactor-code-part-1.md#standardize-functions).


<div align="center">
  <div>
    Next: <a href="./07-step-3-update-unit-tests.md">Step 3: Update unit tests</a>
  </div>
  <div>
    Previous: <a href="./05-step-1-update-acceptance-tests-part-2.md">Step 1: Update acceptance tests (Part 2)</a>
  </div>
</div>
