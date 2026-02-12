# @codemod-utils/files

_Utilities for handling files_


## What is it?

`@codemod-utils/files` wraps the synchronous methods from `node:fs`, `node:path`, and `glob` to help you update many files in the same way.


## API

> [!TIP]
> 
> Many of the methods rely on a **file path**, a string that represents the location of a file. Have a look at [`findFiles`](#api-find-files) first, since it can return the paths of all files that you are interested in.


### copyFiles {#api-copy-files}

Copies files from one directory (source) to another (destination). Creates the destination directory if it doesn't exist.

::: code-group

```ts [Signature]
/**
 * @param filePathMap
 *
 * A mapping from source to destination.
 *
 * @param options
 *
 * An object with `projectRoot`.
 */
function copyFiles(
  filePathMap: FilePathMap,
  options: Record<string, unknown> & {
    projectRoot: string;
  },
): void;
```


```ts [Example]
/**
 * Copy `LICENSE.md` and `README.md` from the project root to the
 * folder `ember-container-query`.
 */
import { copyFiles } from '@codemod-utils/files';

const filePathMap = new Map([
  ['LICENSE.md', 'ember-container-query/LICENSE.md'],
  ['README.md', 'ember-container-query/README.md'],
]);

copyFiles(filePathMap, {
  projectRoot,
});
```

:::


### createDirectory {#api-create-directory}

Creates the directories specified in the file path, if they don't exist yet.

> [!NOTE]
>
> Likely, you won't need this method but [`createFiles`](#api-create-files) instead.

::: code-group

```ts [Signature]
/**
 * @param filePath
 *
 * A file path.
 */
function createDirectory(filePath: FilePath): void;
```

```ts [Example]
/**
 * Create the folder `ember-container-query` if it doesn't exist.
 */
import { createDirectory } from '@codemod-utils/files';

const newFilePath = 'ember-container-query/LICENSE.md';
const destination = join(projectRoot, newFilePath);

createDirectory(destination);
```

:::


### createFiles {#api-create-files}

Create files. Creates the destination directory if it doesn't exist.

::: code-group

```ts [Signature]
/**
 * @param fileMap
 *
 * A mapping between the file path and the file content (UTF-8).
 *
 * @param options
 *
 * An object with `projectRoot`.
 */
function createFiles(
  fileMap: FileMap,
  options: Record<string, unknown> & {
    projectRoot: string;
  },
): void;
```

```ts [Example]
/**
 * Create `LICENSE.md` and `README.md` in the project root.
 */
import { createFiles } from '@codemod-utils/files';

const fileMap = new Map([
  ['LICENSE.md', 'The MIT License (MIT)'],
  ['README.md', '# ember-container-query'],
]);

createFiles(fileMap, {
  projectRoot,
});
```

:::


### findFiles {#api-find-files}

Often, you will want a codemod step to apply to select files. `findFiles` provides the paths of all files that match your search criteria (i.e. [glob pattern](https://github.com/isaacs/node-glob#glob-primer), ignore list, and project root). The paths are sorted in alphabetical order.

> [!IMPORTANT]
>
> Glob patterns should always use `/` as a path separator, even on Windows systems.

::: code-group

```ts [Signature]
/**
 * @param pattern
 *
 * A glob pattern that describes which files you are looking for.
 *
 * @param options
 *
 * An object with `ignoreList` (an array of file paths or glob
 * patterns) and `projectRoot`.
 *
 * @return
 *
 * Paths of all files that match your search criteria.
 */
function findFiles(
  pattern: string | string[],
  options: Record<string, unknown> & {
    ignoreList?: string[];
    projectRoot: string;
  },
): FilePath[];
```

```ts [Example 1]
/**
 * Find all component templates in an Ember app.
 */
import { findFiles } from '@codemod-utils/files';

const filePaths = findFiles('app/components/**/*.hbs', {
  projectRoot,
});
```

```ts [Example 2]
/**
 * Find all component classes in an Ember app. Provide `ignoreList`,
 * an array of file paths or glob patterns, to exclude files.
 */
import { findFiles } from '@codemod-utils/files';

const filePaths = findFiles('app/components/**/*.{js,ts}', {
  ignoreList: ['**/*.d.ts'],
  projectRoot,
});
```

```ts [Example 3]
/**
 * To look for multiple types of files, pass an array of glob patterns
 * (pattern A or pattern B or ...).
 */
import { findFiles } from '@codemod-utils/files';

const filePaths1 = findFiles([
  'LICENSE.md',
  'README.md',
], {
  projectRoot,
});

const filePaths2 = findFiles([
  'app/components/**/*.hbs',
  'tests/integration/components/**/*-test.{js,ts}',
], {
  projectRoot,
});
```

:::


### getPackageRoots {#api-get-package-roots}

Returns the roots of all packages in a project.

::: code-group

```ts [Signature]
/**
 * @param options
 *
 * An object with `projectRoot`.
 */
function getPackageRoots(
  options: Record<string, unknown> & {
    projectRoot: string;
  },
): string[];
```

```ts [Example]
/**
 * Analyze each package by reading `package.json`.
 */
import { readPackageJson } from '@codemod-utils/package-json';

const packageRoots = getPackageRoots({
  projectRoot,
});

packageRoots.forEach((packageRoot) => {
  const packageJson = readPackageJson({ projectRoot: packageRoot });

  // ...
});
```

:::


### mapFilePaths {#api-map-file-paths}

Creates a mapping of file paths, which can then be passed to [`copyFiles`](#api-copy-files) or [`moveFiles`](#api-move-files).

::: code-group

```ts [Signature]
/**
 * @param filePaths
 *
 * An array of file paths. The array may come from `findFiles()`.
 *
 * @param options
 *
 * An object with `from` and `to`.
 */
function mapFilePaths(
  filePaths: FilePath[],
  options: {
    from: string;
    to: string;
  },
): Map<string, string>;
```

```ts [Example]
/**
 * Map `LICENSE.md` to `ember-container-query/LICENSE.md` (and
 * similarly for `README.md`).
 */
import { mapFilePaths } from '@codemod-utils/files';

const filePaths = ['LICENSE.md', 'README.md'];

const filePathMap = mapFilePaths(filePaths, {
  from: '',
  to: 'ember-container-query',
});
```

:::


### moveFiles {#api-move-files}

Moves files from one directory (source) to another (destination). Creates the destination directory if it doesn't exist. Removes the source directory if it is empty.

::: code-group

```ts [Signature]
/**
 * @param filePathMap
 *
 * A mapping from source to destination.
 *
 * @param options
 *
 * An object with `projectRoot`.
 */
function moveFiles(
  filePathMap: FilePathMap,
  options: Options & {
    projectRoot: string;
  },
): void;
```

```ts [Example]
/**
 * Move `LICENSE.md` and `README.md` from the project root to a
 * folder named `ember-container-query`.
 */
import { moveFiles } from '@codemod-utils/files';

const filePathMap = new Map([
  ['LICENSE.md', 'ember-container-query/LICENSE.md'],
  ['README.md', 'ember-container-query/README.md'],
]);

moveFiles(filePathMap, {
  projectRoot,
});
```

:::


### parseFilePath {#api-parse-file-path}

Parses a file path, similarly to `parse()` from `node:path`, but correctly handles file extensions with more than one `.`, e.g. `.d.ts` and `.css.d.ts`.

::: code-group

```ts [Signature]
/**
 * @param filePath
 *
 * A file path.
 *
 * @return
 *
 * An object with `base`, `dir`, `ext`, and `name`.
 */
function parseFilePath(filePath: FilePath): ParsedPath;
```

```ts [Example]
import { parseFilePath } from '@codemod-utils/files';

const filePath = 'src/components/navigation-menu.d.ts';
const { base, dir, ext, name } = parseFilePath(filePath);

// base -> 'navigation-menu.d.ts'
// dir  -> 'src/components'
// ext  -> '.d.ts'
// name -> 'navigation-menu'
```

:::


### removeDirectoryIfEmpty {#api-remove-directory-if-empty}

Removes the directories specified in the file path, if they are empty.

> [!TIP]
>
> Likely, you won't need this method but [`removeFiles`](#api-remove-files) instead.

::: code-group

```ts [Signature]
function removeDirectoryIfEmpty(
  filePath: FilePath,
  options: Record<string, unknown> & {
    projectRoot: string;
  },
): void;
```

```ts [Example]
/**
 * Remove the folder `ember-container-query` if it is empty.
 */
import { removeDirectoryIfEmpty } from '@codemod-utils/files';

const filePath = 'ember-container-query/LICENSE.md';

removeDirectoryIfEmpty(filePath, {
  projectRoot,
});
```

:::


### removeFiles {#api-remove-files}

Removes files. Removes the source directory if it is empty.

::: code-group

```ts [Signature]
/**
 * @param filePaths
 *
 * An array of file paths.
 *
 * @param options
 *
 * An object with `projectRoot`.
 */
function removeFiles(
  filePaths: FilePath[],
  options: Record<string, unknown> & {
    projectRoot: string;
  },
): void;
```

```ts [Example]
/**
 * Remove `LICENSE.md` and `README.md` from the project root.
 */
import { removeFiles } from '@codemod-utils/files';

const filePaths = ['LICENSE.md', 'README.md'];

removeFiles(filePaths, {
  projectRoot,
});
```

:::


### renamePathByDirectory {#api-rename-path-by-directory}

Forms a new file path by altering the path's directory.

::: code-group

```ts [Signature]
/**
 * @param filePath
 *
 * A file path.
 *
 * @param options
 *
 * An object with `from` and `to`.
 *
 * @return
 *
 * A file path.
 */
function renamePathByDirectory(
  filePath: FilePath,
  options: {
    from: string;
    to: string;
  },
): FilePath;
```

```ts [Example]
/**
 * Prepare to move components from `addon` to `ember-container-query/src`.
 */
import { renamePathByDirectory } from '@codemod-utils/files';

const oldFilePath = 'addon/components/container-query.hbs';

const newFilePath = renamePathByDirectory(oldFilePath, {
  from: 'addon',
  to: 'ember-container-query/src',
});

// newFilePath -> 'ember-container-query/src/components/container-query.hbs'
```

:::
