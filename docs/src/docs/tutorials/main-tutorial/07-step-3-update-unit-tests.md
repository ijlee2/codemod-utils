# Step 3: Update unit tests

We have a more robust `getModuleName`, one that supports multiple entity types living in the same folder. Let's create a step for the last time, called `rename-unit-tests`.

Goals:

- Learn by repetition
- Prefer duplication over premature abstraction
- Go with simple


## Were we right?

If the approach that we took for `rename-integration-tests` is right, then we should be able to reuse code almost entirely.

::: code-group

```diff [src/index.ts]
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

```diff [src/steps/index.ts]
export * from './create-options.js';
export * from './rename-acceptance-tests.js';
export * from './rename-integration-tests.js';
+ export * from './rename-unit-tests.js';
```

```diff [src/steps/rename-unit-tests.ts]
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

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
  const [folder, ...remainingPaths] = dir.split(sep);
  const entityType = folderToEntityType.get(folder!);

  return {
    entityType,
    remainingPath: remainingPaths.join(sep),
  };
}

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

-   dir = relative('tests/integration', dir);
+   dir = relative('tests/unit', dir);
  name = name.replace(/-test$/, '');

  const { entityType, remainingPath } = parseEntity(dir);
  const entityName = join(remainingPath, name).replaceAll(sep, '/');

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

:::

> [!NOTE]
>
> I highlighted only the differences between `rename-integration-tests` and `rename-unit-tests`.
>
> Since `'instance-initializers'` and `'utils'` need to be mapped to the words `'Instance Initializer'` and `'Utility'`, installing a package that has methods like `singularize` and `capitalize` wouldn't have been enough. Again, avoid premature abstractions.

I think it is. Of course, I've shown you the ideal case where everything fits together well. When it's time to write your own codemod, don't be afraid to experiment with the steps and find the clearest path to the solution.

Before proceeding further, run the shell script to update the output fixture files for the last time.
