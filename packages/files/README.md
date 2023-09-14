[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/files

_Utilities for handling files_


## What is it?

`@codemod-utils/files` wraps the synchronous methods from `node:fs`, `node:path`, and `glob` to help you update many files in the same way.


## API

Many of the methods make use of the **file path**, a string that represents the location of a file. Therefore, I recommend learning [`findFiles`](#findfiles-unionize) first, as it returns the paths of all files that match the search criteria.


### copyFiles

Copy files from one directory to another.

<details>

<summary>Example</summary>

In [`ember-codemod-v1-to-v2`](https://github.com/ijlee2/ember-codemod-v1-to-v2/), we want to copy some files from the project root to the addon package.

```js
import { copyFiles, mapFilePaths } from '@codemod-utils/files';

const filePaths = [/* ... */];

const filePathMap = mapFilePaths(filePaths, {
  from: '',
  to: '__addonLocation__',
});

copyFiles(filePathMap, {
  projectRoot: '__projectRoot__',
});
```

</details>


### createDirectory

Ensure that, given a file path, the directories exist.

⚠️ Likely, you won't need this method. Call [`createFiles`](#createfiles) instead.


### createFiles

Create files in bulk. You will need to provide a mapping between file paths and file contents.

<details>

<summary>Example</summary>

```js
import { createFiles } from '@codemod-utils/files';

const fileMap = new Map([
  ['LICENSE.md', 'The MIT License (MIT)'],
  ['README.md', '# ember-container-query'],
]);

createFiles(fileMap, {
  projectRoot: '__projectRoot__',
});
```

</details>


### findFiles, unionize

Often, you will want a codemod step to apply to select files. `findFiles` provides the paths of all files that match your search criteria (i.e. [glob pattern](https://github.com/isaacs/node-glob#glob-primer), ignore list, and project root). The paths are sorted in alphabetical order.

<details>

<summary>Example</summary>

In [`ember-codemod-v1-to-v2`](https://github.com/ijlee2/ember-codemod-v1-to-v2/), we want to move the `tests/dummy` folder to the test-app package.

```js
import { findfiles } from '@codemod-utils/files';

const filePaths = findFiles('tests/dummy/**/*', {
  projectRoot: '__projectRoot__',
});
```

</details>

You can provide `ignoreList`, an array of file paths or glob patterns, to exclude files.

<details>

<summary>Example</summary>

In [`ember-codemod-v1-to-v2`](https://github.com/ijlee2/ember-codemod-v1-to-v2/), we want to move some files in `tests` to the test-app package's `tests` folder.

```js
import { findfiles } from '@codemod-utils/files';

const filePaths = findFiles('tests/**/*', {
  ignoreList: ['tests/dummy/**/*'],
  projectRoot: '__projectRoot__',
});
```

</details>

Lastly, you can use `unionize` to look for multiple files ("possibly file A or file B or ..."):

<details>

<summary>Example</summary>

```js
import { findfiles, unionize } from '@codemod-utils/files';

const files = ['LICENSE.md', 'README.md'];

const filePaths = findFiles(unionize(files), {
  projectRoot: '__projectRoot__',
});
```

</details>


### mapFilePaths

Create a mapping of file paths, which can be passed to [`createFiles`](#createfiles) or [`moveFiles`](#movefiles). 


### moveFiles

Move files from one directory to another.

<details>

<summary>Example</summary>

In [`ember-codemod-v1-to-v2`](https://github.com/ijlee2/ember-codemod-v1-to-v2/), we want to move some files from the project root to the test-app package.

```js
import { mapFilePaths, moveFiles } from '@codemod-utils/files';

const filePaths = [/* ... */];

const filePathMap = mapFilePaths(filePaths, {
  from: '',
  to: '__testAppLocation__',
});

moveFiles(filePathMap, {
  projectRoot: '__projectRoot__',
});
```

</details>


### parseFilePath

Parse a file path, just like you can with `parse` from `node:path`. `parseFilePath` can handle file extensions with more than one `.` (e.g. `.d.ts`, `.css.d.ts`).

<details>

<summary>Example</summary>

```js
import { parseFilePath } from '@codemod-utils/files';

const filePath = 'src/components/navigation-menu.d.ts';
const { base, dir, ext, name } = parseFilePath(filePath);

/*
  base = 'navigation-menu.d.ts'
  dir = 'src/components'
  ext = '.d.ts'
  name = 'navigation-menu'
*/
```

</details>


### removeDirectoryIfEmpty

Ensure that, after deleting a file, the directories in the file path are removed if empty.

⚠️ Likely, you won't need this method. Call [`removeFiles`](#removefiles) instead.


### removeFiles

Remove files in bulk.

<details>

<summary>Example</summary>

```js
import { removeFiles } from '@codemod-utils/files';

const filePaths = ['LICENSE.md', 'README.md'];

removeFiles(filePaths, {
  projectRoot: '__projectRoot__',
});
```

</details>


### renamePathByDirectory

Get a new file path by altering the path's directory.

<details>

<summary>Example</summary>

In [`ember-codemod-v1-to-v2`](https://github.com/ijlee2/ember-codemod-v1-to-v2/), we want to compute `appReexports`. To do so, we find all files in the `app` folder, then remove the word `app` from each file path.

```js
import { findFiles, renamePathByDirectory } from '@codemod-utils/files';

function getAppReexports(options) {
  const { projectRoot } = options;

  const filePaths = findFiles('app/**/*.js', {
    cwd: projectRoot,
  });

  return filePaths
    .map((filePath) => {
      return renameDirectory(filePath, {
        from: 'app',
        to: '',
      });
    })
    .sort();
}
```

</details>


### renamePathByFile

Get a new file path by altering the path's file name.

<details>

<summary>Example</summary>

In [`ember-codemod-pod-to-octane`](https://github.com/ijlee2/ember-codemod-pod-to-octane/), we want to "un-pod" components. To do so, we find all files in the `app/components` folder, then adjust the file name.

```js
import { findFiles, renamePathByFile } from '@codemod-utils/files';

function migrationStrategyForComponentClasses(options) {
  const { projectRoot } = options;

  const filePaths = findFiles('app/components/**/component.{d.ts,js,ts}', {
    projectRoot,
  });

  return filePaths.map((oldFilePath) => {
    const newFilePath = renamePathByFile(oldFilePath, {
      find: {
        directory: 'app/components',
        file: 'component',
      },
      replace: (key) => {
        return `app/components/${key}`;
      },
    });

    return [oldFilePath, newFilePath];
  });
}
```

</details>


## Compatibility

- Node.js v18 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
