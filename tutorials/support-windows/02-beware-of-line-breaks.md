# Beware of line breaks

Windows uses `\r\n` (also called a CRLF) for a line break and `node:os` provides `EOL`. The problem is, Windows can also handle files with `\n` or a mix. Moreover, output fixtures can end up with `\r\n`'s when tests are run on Windows.

The uncertainty in line breaks makes reading and writing files non-trivial. For simplicity, we'll always prefer `\r\n` on Windows when writing files. End-users who want `\n` can use `git` and `prettier` to remove CRLFs.


## When to always use `EOL`

### `JSON.stringify()`

`JSON.stringify()` uses `\n` for line breaks. Before saving the result to a file, make sure to replace `\n` with `EOL`.

```diff
import { EOL } from 'node:os';
import { join } from 'node:path';

import { readPackageJson } from '@codemod-utils/package-json';

function updatePackageJson(options: Options): void {
  const { projectRoot } = options;

  const packageJson = readPackageJson({ projectRoot });

  // ...

-   const file = JSON.stringify(packageJson, null, 2) + '\n';
+   const file = JSON.stringify(packageJson, null, 2).replaceAll('\n', EOL) + EOL;

  writeFileSync(join(projectRoot, 'package.json'), file, 'utf8');
}
```


### Test fixtures

Fixtures files should use `EOL` so that the same test can pass on POSIX and Windows. `@codemod-utils/tests` provides `normalizeFile()` to hide the implementation detail.

```diff
- import { assert, test } from '@codemod-utils/tests';
+ import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { renameModule } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | rename-module', function () {
-   const oldFile = [
+   const oldFile = normalizeFile([
    `module('Old name', function (hooks) {`,
    `  module('Old name', function (nestedHooks) {});`,
    `});`,
    ``,
-   ].join('\n');
+   ]);

  const newFile = renameModule(oldFile, {
    isTypeScript: true,
    moduleName: 'New name',
  });

  assert.strictEqual(
    newFile,
-     [
+     normalizeFile([
      `module('New name', function (hooks) {`,
      `  module('Old name', function (nestedHooks) {});`,
      `});`,
      ``,
-     ].join('\n'),
+     ]),
  );
});
```

In some cases, making a test pass on Windows involves high cost and little reward. For example, `content-tag` (the underlying dependency of `@codemod-utils/ast-template-tag`) returns different character and line indices on Windows. It'd be a pain to assert their values with a conditional branch, and to update these values manually if you need to change the input file.

If you want to run a test only on POSIX, you can write a test helper.

```ts
/* tests/helpers/test-on-posix.ts */
import { EOL } from 'node:os';

import { test } from '@codemod-utils/tests';

const onPosix = EOL === '\n';

export function testOnPosix(...parameters: Parameters<typeof test>): void {
  if (onPosix) {
    test(...parameters);
  }
}
```

```diff
- import { assert, test } from '@codemod-utils/tests';
+ import { assert, normalizeFile } from '@codemod-utils/tests';

import { getClassToStyles } from '../../../../src/utils/css/index.js';
+ import { testOnPosix } from '../../../helpers/index.js';

- test('utils | css | get-class-to-styles', function () {
+ testOnPosix('utils | css | get-class-to-styles', function () {
  /* ... */
});
```


<div align="center">
  <div>
    Previous: <a href="./01-beware-of-file-paths.md">Beware of file paths</a>
  </div>
</div>
