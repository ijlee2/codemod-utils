# Refactor code

Now that we have a working solution, let's simplify it.

We are allowed to refactor code, because we have the acceptance test `tests/index/sample-project.test.ts` (acceptance tests don't care about implementation detail) and a large number of fixture files for this test (we covered enough base and edge cases). If there aren't enough tests or fixture files to cover the usual 80%, I encourage you to do so before you refactor code.

Goals:

- Extract functions
- Standardize functions


## Split a step into substeps

Currently, `src/index.ts` shows that the codemod takes 3 steps, excluding `create-options`.

```ts
export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

  renameAcceptanceTests(options);
  renameIntegrationTests(options);
  renameUnitTests(options);
}
```

We could leave the steps as is, or group them since they are related (all have to do with renaming tests). To illustrate an example of a step with substeps, we'll choose the latter approach.

See if you can

- Create the `src/steps/rename-tests` folder.
- Move the 3 steps to the new folder (they are now substeps).
- Create the `rename-tests` step, which runs the 3 substeps.

so that `src/index.ts` can show instead,

```ts
import { createOptions, renameTests } from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

  renameTests(options);
}
```

<details>

<summary>Solution: <code>src/steps/rename-tests/index.ts</code></summary>

```ts
export * from './rename-acceptance-tests.js';
export * from './rename-integration-tests.js';
export * from './rename-unit-tests.js';
```

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-acceptance-tests.ts</code></summary>

The code below shows only the lines that need to be changed after we move the file.

```diff
- import type { Options } from '../types/index.js';
+ import type { Options } from '../../types/index.js';
```

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-integration-tests.ts</code></summary>

The code below shows only the lines that need to be changed after we move the file.

```diff
- import type { Options } from '../types/index.js';
+ import type { Options } from '../../types/index.js';
```

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-unit-tests.ts</code></summary>

The code below shows only the lines that need to be changed after we move the file.

```diff
- import type { Options } from '../types/index.js';
+ import type { Options } from '../../types/index.js';
```

</details>

<details>

<summary>Solution: <code>src/steps/index.ts</code></summary>

```diff
export * from './create-options.js';
- export * from './rename-acceptance-tests.js';
- export * from './rename-integration-tests.js';
- export * from './rename-unit-tests.js';
+ export * from './rename-tests.js';
```

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests.ts</code></summary>

```ts
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

</details>

Both `lint` and `test` should continue to pass.

Note that we have performed a refactoring technique called "extract functions." Had we begun the tutorial by creating the `rename-tests` step—one that updates acceptance, integration, and unit tests (all in a single, large function)—we would now extract a function for each substep so that `renameTests()` clearly shows what's happening inside.

```ts
export function renameTests(options: Options): void {
  renameAcceptanceTests(options);
  renameIntegrationTests(options);
  renameUnitTests(options);
}
```


## Extract utilities

In Chapters 5-7, we duplicated code so that we can avoid premature abstractions and quickly implement the steps. Now that the codemod is working and we understand our code better, let's try removing duplicated code.


### renameModule()

A function that we can easily extract is `renameModule()`, because the implementation is the same for all 3 substeps.

- Create the `src/utils/rename-tests` folder.
- Extract `renameModule()` to the file `src/utils/rename-tests/rename-module.ts`.
- Re-export `renameModule()` from the file `src/utils/rename-tests/index.ts`.
- Consume `renameModule()` in all 3 substeps.

<details>

<summary>Solution: <code>src/utils/rename-tests/index.ts</code></summary>

```ts
export * from './rename-module.js';
```

</details>

<details>

<summary>Solution: <code>src/utils/rename-tests/rename-module.ts</code></summary>

```ts
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-acceptance-tests.ts</code></summary>

```diff
- /* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-integration-tests.ts</code></summary>

```diff
- /* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-unit-tests.ts</code></summary>

```diff
- /* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

</details>


### parseEntity()

Next, let's extract `parseEntity()`, whose implementation is the same in `rename-integration-tests` and `rename-unit-tests`. We'll move the function to the `src/utils/rename-tests` folder.

<details>

<summary>Solution: <code>src/utils/rename-tests/index.ts</code></summary>

```diff
+ export * from './parse-entity.js';
export * from './rename-module.js';
```

</details>

<details>

Note, `parseEntity()` has an additional argument (`folderToEntityType`).

<summary>Solution: <code>src/utils/rename-tests/parse-entity.ts</code></summary>

```ts
export function parseEntity(
  dir: string,
  folderToEntityType: Map<string, string>,
): {
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

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-integration-tests.ts</code></summary>

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

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

  dir = dir.replace(/^tests\/integration(\/)?/, '');
  name = name.replace(/-test$/, '');

-   const { entityType, remainingPath } = parseEntity(dir);
+   const { entityType, remainingPath } = parseEntity(dir, folderToEntityType);
  const entityName = join(remainingPath, name);

  // a.k.a. friendlyTestDescription
  return ['Integration', entityType, entityName].join(' | ');
}

export function renameIntegrationTests(options: Options): void {
  // ...
}
```

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-unit-tests.ts</code></summary>

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

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

  dir = dir.replace(/^tests\/unit(\/)?/, '');
  name = name.replace(/-test$/, '');

-   const { entityType, remainingPath } = parseEntity(dir);
+   const { entityType, remainingPath } = parseEntity(dir, folderToEntityType);
  const entityName = join(remainingPath, name);

  // a.k.a. friendlyTestDescription
  return ['Unit', entityType, entityName].join(' | ');
}

export function renameUnitTests(options: Options): void {
  // ...
}
```

</details>


## Standardize functions

At the moment, we can't (and shouldn't) extract `getModuleName()` as a utility, because the implementation differs among the substeps. Namely, `rename-acceptance-tests` doesn't have the notion of `entityType`.

You might also remember the fine print from Chapter 6. When `entityType` is `undefined` (i.e. the entity type is something that our codemod doesn't support), `getModuleName()` will return a funny-looking string like `'Integration |  | foo/bar'`.

We can address both problems by standardizing the `getModuleName()` function. In some sense, we are standardizing its **interface**; in particular, the output of the function.

- Update `getModuleName()` in `rename-acceptance-tests` so that the return statement includes `entityType`:

    ```ts
    return ['Acceptance', entityType, entityName].join(' | ');
    ```

- Update `getModuleName()` in all 3 substeps so that it handles the edge case of `entityType` being `undefined`. (Hint: Make an early exit in `parseEntity()`.)

<details>

<summary>Solution: <code>src/utils/rename-tests/parse-entity.ts</code></summary>

```diff
export function parseEntity(
  dir: string,
  folderToEntityType: Map<string, string>,
): {
  entityType: string | undefined;
  remainingPath: string;
} {
  const [folder, ...remainingPaths] = dir.split('/');
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
    remainingPath: remainingPaths.join('/'),
  };
}
```

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-acceptance-tests.ts</code></summary>

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
- import { renameModule } from '../../utils/rename-tests/index.js';
+ import { parseEntity, renameModule } from '../../utils/rename-tests/index.js';
+ 
+ const folderToEntityType = new Map<string, string>();

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = dir.replace(/^tests\/acceptance(\/)?/, '');
  name = name.replace(/-test$/, '');

-   const entityName = join(dir, name);
+   const { entityType, remainingPath } = parseEntity(dir, folderToEntityType);
+   const entityName = join(remainingPath, name);

  // a.k.a. friendlyTestDescription
-   return ['Acceptance', entityName].join(' | ');
+   return ['Acceptance', entityType, entityName].filter(Boolean).join(' | ');
}

export function renameAcceptanceTests(options: Options): void {
  // ...
}
```

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-integration-tests.ts</code></summary>

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
import { parseEntity, renameModule } from '../../utils/rename-tests/index.js';

const folderToEntityType = new Map([
  // ...
]);

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = dir.replace(/^tests\/integration(\/)?/, '');
  name = name.replace(/-test$/, '');

  const { entityType, remainingPath } = parseEntity(dir, folderToEntityType);
  const entityName = join(remainingPath, name);

  // a.k.a. friendlyTestDescription
-   return ['Integration', entityType, entityName].join(' | ');
+   return ['Integration', entityType, entityName].filter(Boolean).join(' | ');
}

export function renameIntegrationTests(options: Options): void {
  // ...
}
```

</details>

<details>

<summary>Solution: <code>src/steps/rename-tests/rename-unit-tests.ts</code></summary>

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../../types/index.js';
import { parseEntity, renameModule } from '../../utils/rename-tests/index.js';

const folderToEntityType = new Map([
  // ...
]);

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = dir.replace(/^tests\/unit(\/)?/, '');
  name = name.replace(/-test$/, '');

  const { entityType, remainingPath } = parseEntity(dir, folderToEntityType);
  const entityName = join(remainingPath, name);

  // a.k.a. friendlyTestDescription
-   return ['Unit', entityType, entityName].join(' | ');
+   return ['Unit', entityType, entityName].filter(Boolean).join(' | ');
}

export function renameUnitTests(options: Options): void {
  // ...
}
```

</details>

Even though `getModuleName()` now has the same "structure" in all 3 steps, we will resist the urge to extract it as a utility so that we don't introduce a wrong abstraction.


<div align="center">
  <div>
    Next: <a href="./09-refactor-code-part-2.md">Refactor code (Part 2)</a>
  </div>
  <div>
    Previous: <a href="./07-step-3-update-unit-tests.md">Step 3: Update unit tests</a>
  </div>
</div>
