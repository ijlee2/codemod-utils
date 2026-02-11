# Beware of file paths

Windows uses `\` for a path separator. While the `node:path` package provides `sep` and several methods to hide this pesky detail, you still need to watch out for these cases.


## When to always use `/` {#when-to-always-use-forward-slash}

### codemodOptions {#when-to-always-use-forward-slash-codemod-options}

User-defined file and folder paths in `codemodOptions` (e.g. `projectRoot`) should always use `/`. This improves user experience and simplifies documentation.

This means, you do not call `normalize` on such paths in source code and tests.

::: code-group

```ts [Example (Correct)]{4,8}
import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
  projectRoot: 'tmp/sample-project',
};

const options: Options = {
  projectRoot: 'tmp/sample-project',
};

export { codemodOptions, options };
```

```ts [Example (Incorrect)]{6,10}
import { normalize } from 'node:path';

import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
  projectRoot: normalize('tmp/sample-project'),
};

const options: Options = {
  projectRoot: normalize('tmp/sample-project'),
};

export { codemodOptions, options };
```

:::


### findFiles {#when-to-always-use-forward-slash-find-files}

A glob pattern should always use `/` as a path separator.

::: code-group

```ts [Example (Correct)]{6-7}
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

:::

Since Node's `join` results in `\`'s on Windows, you should watch out for the code pattern `findFiles(join(...))`.

::: code-group

```ts [Example (Correct)]{6,12,16}
import { join, sep } from 'node:path';

import { findFiles } from '@codemod-utils/files';

function normalizedJoin(...folders: string[]): string {
  return join(...folders).replaceAll(sep, '/');
}

function updateHbs(options: Options): void {
  const { folder, projectRoot } = options;

  const components = findFiles(normalizedJoin('app/components', folder, '**/*.hbs'), {
    projectRoot,
  });

  const routes = findFiles(normalizedJoin('app/templates', folder, '**/*.hbs'), {
    projectRoot,
  });

  // ...
}
```

```ts [Example (Incorrect)]{8,12}
import { join } from 'node:path';

import { findFiles } from '@codemod-utils/files';

function updateHbs(options: Options): void {
  const { folder, projectRoot } = options;

  const components = findFiles(join('app/components', folder, '**/*.hbs'), {
    projectRoot,
  });

  const routes = findFiles(join('app/templates', folder, '**/*.hbs'), {
    projectRoot,
  });

  // ...
}
```

:::


### Entity names in Ember {#when-to-always-use-forward-slash-entity-names-in-ember}

Entity names are dasherized and use `/` for the path separator. If you need to derive the entity name from the file path, make sure to use `/`.

::: code-group

```ts [Example (Correct)]{8,11}
import { join, relative, sep } from 'node:path';

import { parseFilePath } from '@codemod-utils/files';

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = relative('tests/acceptance', dir);
  name = name.replace(/-test$/, '');

  const entityName = join(dir, name).replaceAll(sep, '/');

  // a.k.a. friendlyTestDescription
  return ['Acceptance', entityName].join(' | ');
}
```

```ts [Example (Incorrect)]{8,11}
import { join } from 'node:path';

import { parseFilePath } from '@codemod-utils/files';

function getModuleName(filePath: string): string {
  let { dir, name } = parseFilePath(filePath);

  dir = dir.replace(/^tests\/acceptance(\/)?/, '');
  name = name.replace(/-test$/, '');

  const entityName = join(dir, name);

  // a.k.a. friendlyTestDescription
  return ['Acceptance', entityName].join(' | ');
}
```

:::


### Import paths {#when-to-always-use-forward-slash-import-paths}

Import paths in `*.{gjs,gts,js,ts}` files use `/`. If you need to derive the import path from some other file path, make sure to call `String.replaceAll(sep, '/')`.



## When not to use `/` {#when-not-to-use-forward-slash}

### Calculations involving file paths {#when-not-to-use-forward-slash-calculations-involving-file-paths}

When the input or output of a calculation is a file path, use `sep` or call `normalize` to get the correct path separator.

::: code-group

```ts [Example (Correct)]{10,22}
import { sep } from 'node:path';

function parseEntity(
  dir: string,
  folderToEntityType: Map<string, string>,
): {
  entityType: string | undefined;
  remainingPath: string;
} {
  const [folder, ...remainingPaths] = dir.split(sep);
  const entityType = folderToEntityType.get(folder!);

  if (entityType === undefined) {
    return {
      entityType,
      remainingPath: dir,
    };
  }

  return {
    entityType,
    remainingPath: remainingPaths.join(sep),
  };
}
```

```ts [Example (Incorrect)]{8,20}
function parseEntity(
  dir: string,
  folderToEntityType: Map<string, string>,
): {
  entityType: string | undefined;
  remainingPath: string;
} {
  const [folder, ...remainingPaths] = dir.split('/');
  const entityType = folderToEntityType.get(folder!);

  if (entityType === undefined) {
    return {
      entityType,
      remainingPath: dir,
    };
  }

  return {
    entityType,
    remainingPath: remainingPaths.join('/'),
  };
}
```

:::

::: code-group

```ts [Example (Correct)]{9}
import { normalize } from 'node:path';

import { parseFilePath } from '@codemod-utils/files';

function getClass(templateFilePath: string) {
  const { dir, ext, name } = parseFilePath(templateFilePath);

  const data = {
    isRouteTemplate: dir.startsWith(normalize('app/templates')),
    isTemplateTag: ext === '.gjs' || ext === '.gts',
  };

  // ...
}
```

```ts [Example (Incorrect)]{7}
import { parseFilePath } from '@codemod-utils/files';

function getClass(templateFilePath: string) {
  const { dir, ext, name } = parseFilePath(templateFilePath);

  const data = {
    isRouteTemplate: dir.startsWith('app/templates'),
    isTemplateTag: ext === '.gjs' || ext === '.gts',
  };

  // ...
}
```

:::

The same advice goes for tests.

::: code-group

```ts [Example (Correct)]{14,20}
import { normalize } from 'node:path';
import { assert, test } from '@codemod-utils/tests';

import { parseEntity } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | parse-entity > base case', function () {
  const folderToEntityType = new Map([
    ['components', 'Component'],
    ['helpers', 'Helper'],
    ['modifiers', 'Modifier'],
  ]);

  const output = parseEntity(
    normalize('components/ui/form'),
    folderToEntityType,
  );

  assert.deepStrictEqual(output, {
    entityType: 'Component',
    remainingPath: normalize('ui/form'),
  });
});
```

```ts [Example (Inorrect)]{13,19}
import { assert, test } from '@codemod-utils/tests';

import { parseEntity } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | parse-entity > base case', function () {
  const folderToEntityType = new Map([
    ['components', 'Component'],
    ['helpers', 'Helper'],
    ['modifiers', 'Modifier'],
  ]);

  const output = parseEntity(
    'components/ui/form',
    folderToEntityType,
  );

  assert.deepStrictEqual(output, {
    entityType: 'Component',
    remainingPath: 'ui/form',
  });
});
```

:::
