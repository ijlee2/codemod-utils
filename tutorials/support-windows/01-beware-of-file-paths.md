# Beware of file paths

Windows uses `\` (not `/`) for a path separator. While `node:path` provides `sep` and several methods to hide this pesky detail, you still need to be wary of these cases.


## When to always use `/`

### `codemodOptions`

To improve user experience and simplify documentation, user-defined file and folder paths in `codemodOptions` (e.g. `projectRoot`) should always use `/`.

This means, you should not call `normalize()` on such paths in your source code and tests.

```diff
/* tests/helpers/shared-test-setups/sample-project.ts */
- import { normalize } from 'node:path';
-
import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
-   projectRoot: normalize('tmp/sample-project'),
+   projectRoot: 'tmp/sample-project',
};

const options: Options = {
-   projectRoot: normalize('tmp/sample-project'),
+   projectRoot: 'tmp/sample-project',
};

export { codemodOptions, options };
```


### `findFiles()`

Glob pattern(s) use `/` as a path separator.

```ts
import { findFiles } from '@codemod-utils/files';

function updateTests(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('tests/**/*-test.{gjs,gts,js,ts}', {
    ignoreList: ['**/*.d.ts'],
    projectRoot,
  });

  // ...
}
```

Since `join()` results in `\`'s on Windows, you should watch out for the code pattern `findFiles(join(...))`.

```diff
- import { join } from 'node:path';
+ import { join, sep } from 'node:path';

import { findFiles } from '@codemod-utils/files';

+ function normalizedJoin(...folders: string[]): string {
+   return join(...folders).replaceAll(sep, '/');
+ }
+
function updateHbs(options: Options): void {
  const { folder, projectRoot } = options;

-   const components = findFiles(join('app/components', folder, '**/*.hbs'), {
+   const components = findFiles(normalizedJoin('app/components', folder, '**/*.hbs'), {
    projectRoot,
  });

-   const routes = findFiles(join('app/templates', folder, '**/*.hbs'), {
+   const routes = findFiles(normalizedJoin('app/templates', folder, '**/*.hbs'), {
    projectRoot,
  });

  // ...
}
```


### Entity names in Ember

Entity names are dasherized and use `/` for folders. If you need to derive the name from the file path, make sure to use `/`.

```diff
- import { join } from 'node:path';
+ import { join, relative, sep } from 'node:path';

import { parseFilePath } from '@codemod-utils/files';

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

-   dir = dir.replace(/^tests\/acceptance(\/)?/, '');
+   dir = relative('tests/acceptance', dir);
  name = name.replace(/-test$/, '');

-   const entityName = join(dir, name);
+   const entityName = join(dir, name).replaceAll(sep, '/');

  // a.k.a. friendlyTestDescription
  return ['Acceptance', entityName].join(' | ');
}
```


### Import paths

Import statements in `*.{gjs,gts,js,ts}` files use `/` for the import path. If you need to derive the import path from some file paths, make sure to call `String.replaceAll(sep, '/')`.



## When not to use `/`

### Calculations involving file paths

When the input or output of a calculation is a file path, use `sep` or `normalize()` to get the correct path separator.

```diff
+ import { sep } from 'node:path';
+
function parseEntity(
  dir: string,
  folderToEntityType: Map<string, string>,
): {
  entityType: string | undefined;
  remainingPath: string;
} {
-   const [folder, ...remainingPaths] = dir.split('/');
+   const [folder, ...remainingPaths] = dir.split(sep);
  const entityType = folderToEntityType.get(folder!);

  if (entityType === undefined) {
    return {
      entityType,
      remainingPath: dir,
    };
  }

  return {
    entityType,
-     remainingPath: remainingPaths.join('/'),
+     remainingPath: remainingPaths.join(sep),
  };
}
```

```diff
+ import { normalize } from 'node:path';
+
import { parseFilePath } from '@codemod-utils/files';

function getClass(templateFilePath: string) {
  const { dir, ext, name } = parseFilePath(templateFilePath);

  const data = {
-     isRouteTemplate: dir.startsWith('app/templates'),
+     isRouteTemplate: dir.startsWith(normalize('app/templates')),
    isTemplateTag: ext === '.gjs' || ext === '.gts',
  };

  // ...
}
```

The same rule applies to tests.

```diff
+ import { normalize } from 'node:path';
+
import { assert, test } from '@codemod-utils/tests';

import { parseEntity } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | parse-entity > base case', function () {
  const folderToEntityType = new Map([
    ['components', 'Component'],
    ['helpers', 'Helper'],
    ['modifiers', 'Modifier'],
  ]);

  const output = parseEntity(
-     'components/ui/form',
+     normalize('components/ui/form'),
    folderToEntityType,
  );

  assert.deepStrictEqual(output, {
    entityType: 'Component',
-     remainingPath: 'ui/form',
+     remainingPath: normalize('ui/form'),
  });
});
```


<div align="center">
  <div>
    Next: <a href="./02-beware-of-line-breaks.md">Beware of line breaks</a>
  </div>
  <div>
    Previous: <a href="./00-introduction.md">Introduction</a>
  </div>
</div>
