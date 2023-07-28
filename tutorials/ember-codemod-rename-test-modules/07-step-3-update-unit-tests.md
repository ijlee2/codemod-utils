# Step 3: Update unit tests

We now have a more robust `getModuleName()`, one that supports test folders like `tests/integration` and `tests/unit` with multiple entity types. Let's create a step for the last time, called `rename-unit-tests`.

Goals:

- Learn by repetition
- Prefer duplication over premature abstraction
- Go with simple


## Were we right?

If the approach that we took for `rename-integration-tests` is right, then we should be able to reuse code almost entirely.

<details>

<summary>Solution: <code>src/steps/rename-unit-tests.ts</code></summary>

I highlighted only the differences between `rename-integration-tests` and `rename-unit-tests`.

Note that, because `'instance-initializers'` and `'utils'` need to be mapped to the words `'Instance Initializer'` and `'Utility'`, installing a package that has `singularize()` and `capitalize()` wouldn't be enough. Again, avoid premature abstractions.

```diff
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { AST } from '@codemod-utils/ast-javascript';
import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

type Data = {
  isTypeScript: boolean;
  moduleName: string;
};

- const folderToEntityType = new Map([
-   ['components', 'Component'],
-   ['helpers', 'Helper'],
-   ['modifiers', 'Modifier'],
- ]);
+ const folderToEntityType = new Map([
+   ['adapters', 'Adapter'],
+   ['controllers', 'Controller'],
+   ['initializers', 'Initializer'],
+   ['instance-initializers', 'Instance Initializer'],
+   ['mixins', 'Mixin'],
+   ['models', 'Model'],
+   ['routes', 'Route'],
+   ['serializers', 'Serializer'],
+   ['services', 'Service'],
+   ['utils', 'Utility'],
+ ]);

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

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

-   dir = dir.replace(/^tests\/integration(\/)?/, '');
+   dir = dir.replace(/^tests\/unit(\/)?/, '');
  name = name.replace(/-test$/, '');

  const { entityType, remainingPath } = parseEntity(dir);
  const entityName = join(remainingPath, name);

  // a.k.a. friendlyTestDescription
-   return ['Integration', entityType, entityName].join(' | ');
+   return ['Unit', entityType, entityName].join(' | ');
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

- export function renameIntegrationTests(options: Options): void {
+ export function renameUnitTests(options: Options): void {
  const { projectRoot } = options;

-   const filePaths = findFiles('tests/integration/**/*-test.{js,ts}', {
+   const filePaths = findFiles('tests/unit/**/*-test.{js,ts}', {
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

<details>

<summary>Solution: <code>src/steps/index.ts</code></summary>

```diff
export * from './create-options.js';
export * from './rename-acceptance-tests.js';
export * from './rename-integration-tests.js';
+ export * from './rename-unit-tests.js';
```

</details>

<details>

<summary>Solution: <code>src/index.ts</code></summary>

```diff
import {
  createOptions,
  renameAcceptanceTests,
  renameIntegrationTests,
+   renameUnitTests,
} from './steps/index.js';
import type { CodemodOptions } from './types/index.js';

export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);

  renameAcceptanceTests(options);
  renameIntegrationTests(options);
+   renameUnitTests(options);
}
```

</details>

I think it is. Of course, I've shown you the ideal case where everything fits together well. When it's time to write your own codemod, don't be afraid to experiment with the steps and find the clearest path to the solution.

Before proceeding further, run the shell script to update the output fixture files for the last time.


<div align="center">
  <div>
    Next: <a href="./08-refactor-code-part-1.md">Refactor code (Part 1)</a>
  </div>
  <div>
    Previous: <a href="./06-step-2-update-integration-tests.md">Step 2: Update integration tests</a>
  </div>
</div>
