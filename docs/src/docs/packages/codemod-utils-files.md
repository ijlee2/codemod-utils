# @codemod-utils/files

_Utilities for handling files_


## What is it?

`@codemod-utils/files` wraps the synchronous methods from `node:fs`, `node:path`, and `glob` to help you update many files in the same way.


## API

Many of the methods make use of the **file path**, a string that represents the location of a file. Therefore, I recommend learning [`findFiles`](#findfiles) first, as it returns the paths of all files that match the search criteria.


### copyFiles

Copies files from one directory (source) to another (destination). Creates the destination directory if it doesn't exist.

<details>

<summary>Example</summary>

Copy `LICENSE.md` and `README.md` from the project root to the folder `ember-container-query`.

```ts
import { copyFiles } from '@codemod-utils/files';

const filePathMap = new Map([
  ['LICENSE.md', 'ember-container-query/LICENSE.md'],
  ['README.md', 'ember-container-query/README.md'],
]);

copyFiles(filePathMap, {
  projectRoot,
});
```

</details>


### createDirectory

Creates the directories specified in the file path, if they don't exist yet.

⚠️ Likely, you won't need this method but [`createFiles`](#createfiles) instead.

<details>

<summary>Example</summary>

Create the folder `ember-container-query` if it doesn't exist.

```ts
import { createDirectory } from '@codemod-utils/files';

const newFilePath = 'ember-container-query/LICENSE.md';
const destination = join(projectRoot, newFilePath);

createDirectory(destination);
```

</details>


### createFiles

Create files. Creates the destination directory if it doesn't exist.

<details>

<summary>Example</summary>

Create `LICENSE.md` and `README.md` in the project root.

```ts
import { createFiles } from '@codemod-utils/files';

const fileMap = new Map([
  ['LICENSE.md', 'The MIT License (MIT)'],
  ['README.md', '# ember-container-query'],
]);

createFiles(fileMap, {
  projectRoot,
});
```

</details>


### findFiles

Often, you will want a codemod step to apply to select files. `findFiles` provides the paths of all files that match your search criteria (i.e. [glob pattern](https://github.com/isaacs/node-glob#glob-primer), ignore list, and project root). The paths are sorted in alphabetical order.

> [!IMPORTANT]
>
> Glob patterns should always use `/` as a path separator, even on Windows systems.

<details>

<summary>Example</summary>

Find all component templates in an Ember app.

```ts
import { findFiles } from '@codemod-utils/files';

const filePaths = findFiles('app/components/**/*.hbs', {
  projectRoot,
});
```

</details>

You can provide `ignoreList`, an array of file paths or glob patterns, to exclude files.

<details>

<summary>Example</summary>

Find all component classes in an Ember app.

```ts
import { findFiles } from '@codemod-utils/files';

const filePaths = findFiles('app/components/**/*.{js,ts}', {
  ignoreList: ['**/*.d.ts'],
  projectRoot,
});
```

</details>

To look for multiple types of files, you can pass an array of glob patterns (pattern A or pattern B or ...).

<details>

<summary>Examples</summary>

```ts
import { findFiles } from '@codemod-utils/files';

const filePaths = findFiles([
  'LICENSE.md',
  'README.md',
], {
  projectRoot,
});
```

```ts
import { findFiles } from '@codemod-utils/files';

const filePaths = findFiles([
  'app/components/**/*.hbs',
  'tests/integration/components/**/*-test.{js,ts}',
], {
  projectRoot,
});
```

</details>


### getPackageRoots

Returns the roots of all packages in a project.

<details>

<summary>Example</summary>

Analyze each package by reading `package.json`.

```ts
import { readPackageJson } from '@codemod-utils/package-json';

const packageRoots = getPackageRoots({
  projectRoot,
});

packageRoots.forEach((packageRoot) => {
  const packageJson = readPackageJson({ projectRoot: packageRoot });

  // ...
});
```

</details>


### mapFilePaths

Creates a mapping of file paths, which can then be passed to [`copyFiles`](#copyfiles) or [`moveFiles`](#movefiles). 

<details>

<summary>Example</summary>

Map `LICENSE.md` to `ember-container-query/LICENSE.md` (and similarly for `README.md`).

```ts
import { mapFilePaths } from '@codemod-utils/files';

const filePaths = ['LICENSE.md', 'README.md'];

const filePathMap = mapFilePaths(filePaths, {
  from: '',
  to: 'ember-container-query',
});
```

</details>


### moveFiles

Moves files from one directory (source) to another (destination). Creates the destination directory if it doesn't exist. Removes the source directory if it is empty.

<details>

<summary>Example</summary>

Move `LICENSE.md` and `README.md` from the project root to a folder named `ember-container-query`.

```ts
import { moveFiles } from '@codemod-utils/files';

const filePathMap = new Map([
  ['LICENSE.md', 'ember-container-query/LICENSE.md'],
  ['README.md', 'ember-container-query/README.md'],
]);

moveFiles(filePathMap, {
  projectRoot,
});
```

</details>


### parseFilePath

Parses a file path, similarly to `parse()` from `node:path`, but correctly handles file extensions with more than one `.`, e.g. `.d.ts` and `.css.d.ts`.

<details>

<summary>Example</summary>

```ts
import { parseFilePath } from '@codemod-utils/files';

const filePath = 'src/components/navigation-menu.d.ts';
const { base, dir, ext, name } = parseFilePath(filePath);

// base -> 'navigation-menu.d.ts'
// dir  -> 'src/components'
// ext  -> '.d.ts'
// name -> 'navigation-menu'
```

</details>


### removeDirectoryIfEmpty

Removes the directories specified in the file path, if they are empty.

⚠️ Likely, you won't need this method but [`removeFiles`](#removefiles) instead.

<details>

<summary>Example</summary>

Remove the folder `ember-container-query` if it is empty.

```ts
import { removeDirectoryIfEmpty } from '@codemod-utils/files';

const filePath = 'ember-container-query/LICENSE.md';

removeDirectoryIfEmpty(filePath, {
  projectRoot,
});
```

</details>


### removeFiles

Removes files. Removes the source directory if it is empty.

<details>

<summary>Example</summary>

Remove `LICENSE.md` and `README.md` from the project root.

```ts
import { removeFiles } from '@codemod-utils/files';

const filePaths = ['LICENSE.md', 'README.md'];

removeFiles(filePaths, {
  projectRoot,
});
```

</details>


### renamePathByDirectory

Forms a new file path by altering the path's directory.

<details>

<summary>Example</summary>

Prepare to move components from `addon` to `ember-container-query/src`.

```ts
import { renamePathByDirectory } from '@codemod-utils/files';

const oldFilePath = 'addon/components/container-query.hbs';

const newFilePath = renamePathByDirectory(oldFilePath, {
  from: 'addon',
  to: 'ember-container-query/src',
});

// newFilePath -> 'ember-container-query/src/components/container-query.hbs'
```

</details>
