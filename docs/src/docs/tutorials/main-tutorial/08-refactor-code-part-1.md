# Refactor code

Now that we have a working solution, let's simplify it.

We are allowed to refactor, because we have the acceptance test `tests/index/sample-project.test.ts` (acceptance tests don't care about implementation detail) and a large number of fixture files for this test (we covered enough base and edge cases). If there aren't enough tests or fixture files to cover the usual 80%, I encourage you to write tests first.

Goals:

- Extract functions
- Standardize functions


## Split a step into substeps

Currently, `src/index.ts` shows that the codemod takes 3 steps after `create-options`.

::: code-group

```ts [src/index.ts]{4-6}
export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

  renameAcceptanceTests(options);
  renameIntegrationTests(options);
  renameUnitTests(options);
}
```

:::

We could leave these steps as is, or group them since they are related (all have to do with renaming tests).

To illustrate a step with substeps, we take the latter approach. See if you can:

- Create the `src/steps/rename-tests` folder.
- Move the 3 steps to the new folder (they are now substeps).
- Create the `rename-tests` step, which runs the 3 substeps.

This way, `src/index.ts` can show the following instead:

::: code-group

```ts [src/index.ts]{7}
import { createOptions, renameTests } from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

  renameTests(options);
}
```

:::

<details>

<summary>Solution</summary>

Some of the diffs below only show what to change after moving the file. Both `lint` and `test` continue to pass.

::: code-group

```diff [src/steps/index.ts]
export * from './create-options.js';
- export * from './rename-acceptance-tests.js';
- export * from './rename-integration-tests.js';
- export * from './rename-unit-tests.js';
+ export * from './rename-tests.js';
```

```ts [src/steps/rename-tests.ts]
import type { Options } from '../types/index.js';
import {
  renameAcceptanceTests,
  renameIntegrationTests,
  renameUnitTests,
} from './rename-tests/index.js';

export function renameTests(options: Options): void {
  renameAcceptanceTests(options);
  renameIntegrationTests(options);
  renameUnitTests(options);
}
```

```ts [src/steps/rename-tests/index.ts]
export * from './rename-acceptance-tests.js';
export * from './rename-integration-tests.js';
export * from './rename-unit-tests.js';
```

```diff [src/steps/rename-tests/rename-acceptance-tests.ts]
- import type { Options } from '../types/index.js';
+ import type { Options } from '../../types/index.js';
```

```diff [src/steps/rename-tests/rename-integration-tests.ts]
- import type { Options } from '../types/index.js';
+ import type { Options } from '../../types/index.js';
```

```diff [src/steps/rename-tests/rename-unit-tests.ts]
- import type { Options } from '../types/index.js';
+ import type { Options } from '../../types/index.js';
```

:::

</details>

> [!NOTE]
>
> We performed a refactoring technique called "extract functions." Had we begun the tutorial by creating the `rename-tests` step—one that updates acceptance, integration, and unit tests (all in a single, large function)—we would now extract a function for each substep so that `renameTests` clearly shows what's happening inside.
>
> ::: code-group
>
> ```ts [src/steps/rename-tests.ts]
> export function renameTests(options: Options): void {
>   renameAcceptanceTests(options);
>   renameIntegrationTests(options);
>   renameUnitTests(options);
> }
> ```
>
> :::


## Extract utilities

In Chapters 5-7, we duplicated code so that we can avoid premature abstractions and quickly implement the steps. Now that the codemod is working and we understand our code better, let's try removing duplicated code.


### renameModule {#extract-utilities-rename-module}

A function that we can easily extract is `renameModule`, because the implementation is the same for all 3 substeps.

1. Create the `src/utils/rename-tests` folder.
1. Extract `renameModule` to the file `src/utils/rename-tests/rename-module.ts`.
1. Re-export `renameModule` from the file `src/utils/rename-tests/index.ts`.
1. Consume `renameModule` in all 3 substeps.

<details>

<summary>Solution</summary>

::: code-group

```diff [src/steps/rename-tests/rename-acceptance-tests.ts]
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

- import { AST } from '@codemod-utils/ast-javascript';
import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
+ import { renameModule } from '../../utils/rename-tests/index.js';

- type Data = {
-   isTypeScript: boolean;
-   moduleName: string;
- };
- 
function getModuleName(filePath: string): string {
  // ...
}

- function renameModule(file: string, data: Data): string {
-   // ...
- }
- 
export function renameAcceptanceTests(options: Options): void {
  // ...
}
```

```diff [src/steps/rename-tests/rename-integration-tests.ts]
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

- import { AST } from '@codemod-utils/ast-javascript';
import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
+ import { renameModule } from '../../utils/rename-tests/index.js';

- type Data = {
-   isTypeScript: boolean;
-   moduleName: string;
- };
- 
const folderToEntityType = new Map([
  // ...
]);

function parseEntity(dir: string): {
  // ...
}

function getModuleName(filePath: string): string {
  // ...
}

- function renameModule(file: string, data: Data): string {
-   // ...
- }
- 
export function renameIntegrationTests(options: Options): void {
  // ...
}
```

```diff [src/steps/rename-tests/rename-unit-tests.ts]
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

- import { AST } from '@codemod-utils/ast-javascript';
import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
+ import { renameModule } from '../../utils/rename-tests/index.js';

- type Data = {
-   isTypeScript: boolean;
-   moduleName: string;
- };
- 
const folderToEntityType = new Map([
  // ...
]);

function parseEntity(dir: string): {
  // ...
}

function getModuleName(filePath: string): string {
  // ...
}

- function renameModule(file: string, data: Data): string {
-   // ...
- }
- 
export function renameUnitTests(options: Options): void {
  // ...
}
```

```ts [src/utils/rename-tests/index.ts]
export * from './rename-module.js';
```

```ts [src/utils/rename-tests/rename-module.ts]
import { AST } from '@codemod-utils/ast-javascript';

type Data = {
  isTypeScript: boolean;
  moduleName: string;
};

export function renameModule(file: string, data: Data): string {
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

:::

</details>


### parseEntity {#extract-utilities-parse-entity}

Next, let's extract `parseEntity`, whose implementation is the same in `rename-integration-tests` and `rename-unit-tests`. We move the function also to the `src/utils/rename-tests` folder.

<details>

<summary>Solution</summary>

Note, `parseEntity` allows an additional argument called `folderToEntityType`.

::: code-group

```diff [src/steps/rename-tests/rename-integration-tests.ts]
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
- import { renameModule } from '../../utils/rename-tests/index.js';
+ import { parseEntity, renameModule } from '../../utils/rename-tests/index.js';

const folderToEntityType = new Map([
  // ...
]);

- function parseEntity(dir: string): {
-   // ...
- }
- 
function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = relative('tests/integration', dir);
  name = name.replace(/-test$/, '');

-   const { entityType, remainingPath } = parseEntity(dir);
+   const { entityType, remainingPath } = parseEntity(dir, folderToEntityType);
  const entityName = join(remainingPath, name).replaceAll(sep, '/');

  // a.k.a. friendlyTestDescription
  return ['Integration', entityType, entityName].join(' | ');
}

export function renameIntegrationTests(options: Options): void {
  // ...
}
```

```diff [src/steps/rename-tests/rename-unit-tests.ts]
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
- import { renameModule } from '../../utils/rename-tests/index.js';
+ import { parseEntity, renameModule } from '../../utils/rename-tests/index.js';

const folderToEntityType = new Map([
  // ...
]);

- function parseEntity(dir: string): {
-   // ...
- }
- 
function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = relative('tests/unit', dir);
  name = name.replace(/-test$/, '');

-   const { entityType, remainingPath } = parseEntity(dir);
+   const { entityType, remainingPath } = parseEntity(dir, folderToEntityType);
  const entityName = join(remainingPath, name).replaceAll(sep, '/');

  // a.k.a. friendlyTestDescription
  return ['Unit', entityType, entityName].join(' | ');
}

export function renameUnitTests(options: Options): void {
  // ...
}
```

```diff [src/utils/rename-tests/index.ts]
+ export * from './parse-entity.js';
export * from './rename-module.js';
```

```ts [src/utils/rename-tests/parse-entity.ts]
import { sep } from 'node:path';

export function parseEntity(
  dir: string,
  folderToEntityType: Map<string, string>,
): {
  entityType: string | undefined;
  remainingPath: string;
} {
  const [folder, ...remainingPaths] = dir.split(sep);
  const entityType = folderToEntityType.get(folder!);

  return {
    entityType,
    remainingPath: remainingPaths.join(sep),
  };
}
```

:::

</details>


## Standardize functions

At the moment, we can't (and shouldn't) extract `getModuleName` as a utility, because the implementation differs among the substeps. Namely, `rename-acceptance-tests` doesn't have the notion of `entityType`.

You might also remember the fine print from Chapter 6. When `entityType` is `undefined` (i.e. our codemod doesn't recognize the entity type), `getModuleName()` will return a funny-looking string like `'Unit |  | foo/bar'`.

We can address both problems by standardizing the `getModuleName` function. In a sense, we are standardizing its **interface**; in particular, the output of the function.

1. Update `getModuleName` in `rename-acceptance-tests` so that the return statement includes `entityType`:

    ```ts
    return ['Acceptance', entityType, entityName].join(' | ');
    ```

1. Update `getModuleName` in all 3 substeps. Handle the edge case of `entityType` being `undefined` by making an early exit in `parseEntity`.

    One possible solution: If `getModuleName` receives the file path of `'tests/unit/resources/remote-data-test.ts'`, then it returns the module name of `'Unit | resources/remote-data'` (instead of `'Unit | | remote-data'`) as an approximate solution.

<details>

<summary>Solution</summary>

::: code-group

```diff [src/steps/rename-tests/rename-acceptance-tests.ts]
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
- import { renameModule } from '../../utils/rename-tests/index.js';
+ import { parseEntity, renameModule } from '../../utils/rename-tests/index.js';
+ 
+ const folderToEntityType = new Map<string, string>();

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = relative('tests/acceptance', dir);
  name = name.replace(/-test$/, '');

-   const entityName = join(dir, name).replaceAll(sep, '/');
+   const { entityType, remainingPath } = parseEntity(dir, folderToEntityType);
+   const entityName = join(remainingPath, name).replaceAll(sep, '/');

  // a.k.a. friendlyTestDescription
-   return ['Acceptance', entityName].join(' | ');
+   return ['Acceptance', entityType, entityName].filter(Boolean).join(' | ');
}

export function renameAcceptanceTests(options: Options): void {
  // ...
}
```

```diff [src/steps/rename-tests/rename-integration-tests.ts]
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
import { parseEntity, renameModule } from '../../utils/rename-tests/index.js';

const folderToEntityType = new Map([
  // ...
]);

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = relative('tests/integration', dir);
  name = name.replace(/-test$/, '');

  const { entityType, remainingPath } = parseEntity(dir, folderToEntityType);
  const entityName = join(remainingPath, name).replaceAll(sep, '/');

  // a.k.a. friendlyTestDescription
-   return ['Integration', entityType, entityName].join(' | ');
+   return ['Integration', entityType, entityName].filter(Boolean).join(' | ');
}

export function renameIntegrationTests(options: Options): void {
  // ...
}
```

```diff [src/steps/rename-tests/rename-unit-tests.ts]
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
import { parseEntity, renameModule } from '../../utils/rename-tests/index.js';

const folderToEntityType = new Map([
  // ...
]);

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = relative('tests/unit', dir);
  name = name.replace(/-test$/, '');

  const { entityType, remainingPath } = parseEntity(dir, folderToEntityType);
  const entityName = join(remainingPath, name).replaceAll(sep, '/');

  // a.k.a. friendlyTestDescription
-   return ['Unit', entityType, entityName].join(' | ');
+   return ['Unit', entityType, entityName].filter(Boolean).join(' | ');
}

export function renameUnitTests(options: Options): void {
  // ...
}
```

```diff [src/utils/rename-tests/parse-entity.ts]
import { sep } from 'node:path';

export function parseEntity(
  dir: string,
  folderToEntityType: Map<string, string>,
): {
  entityType: string | undefined;
  remainingPath: string;
} {
  const [folder, ...remainingPaths] = dir.split(sep);
  const entityType = folderToEntityType.get(folder!);

+   if (entityType === undefined) {
+     return {
+       entityType,
+       remainingPath: dir,
+     };
+   }
+ 
  return {
    entityType,
    remainingPath: remainingPaths.join(sep),
  };
}
```

:::

</details>

Even though `getModuleName` now has the same "structure" in all 3 steps, we resist the urge to extract it as a utility so that we don't introduce a wrong abstraction.
