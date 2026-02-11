# Beware of line breaks

Windows uses `\r\n` (called CRLF) to break lines. The problem is, while the `node:os` package provides `EOL` (end of line), Windows can also handle files with `\n` or a mix. Moreover, output fixture files may end up with `\r\n`'s when tests are run on Windows.

Reading and writing files aren't trivial due to the uncertainty in line breaks. For simplicity, we'll let codemods always use `\r\n` when writing files on Windows. End-developers who want `\n` can use `git` and `prettier` to remove CRLFs.


## When to always use `EOL`

### `JSON.stringify` {#when-to-always-use-eol-json-stringify}

`JSON.stringify` uses `\n` for line breaks. Before saving the result to a file, make sure to replace `\n` with `EOL`.

::: code-group

```ts [Example (Correct)]{13}
import { EOL } from 'node:os';
import { join } from 'node:path';

import { readPackageJson } from '@codemod-utils/package-json';

function updatePackageJson(options: Options): void {
  const { projectRoot } = options;

  const packageJson = readPackageJson({ projectRoot });

  // ...

  const file = JSON.stringify(packageJson, null, 2).replaceAll('\n', EOL) + EOL;

  writeFileSync(join(projectRoot, 'package.json'), file, 'utf8');
}
```

```ts [Example (Inorrect)]{13}
import { EOL } from 'node:os';
import { join } from 'node:path';

import { readPackageJson } from '@codemod-utils/package-json';

function updatePackageJson(options: Options): void {
  const { projectRoot } = options;

  const packageJson = readPackageJson({ projectRoot });

  // ...

  const file = JSON.stringify(packageJson, null, 2) + '\n';

  writeFileSync(join(projectRoot, 'package.json'), file, 'utf8');
}
```

:::


### Test fixtures {#when-to-always-use-eol-test-fixtures}

Fixtures files—those that are defined in a test file—should use `EOL` so that the same test can pass on POSIX and Windows. `@codemod-utils/tests` provides `normalizeFile` that picks the correct character for a line break.

::: code-group

```ts [Example (Correct)]{6-11,20-25}
import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { renameModule } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | rename-module', function () {
  const oldFile = normalizeFile([
    `module('Old name', function (hooks) {`,
    `  module('Old name', function (nestedHooks) {});`,
    `});`,
    ``,
  ]);

  const newFile = renameModule(oldFile, {
    isTypeScript: true,
    moduleName: 'New name',
  });

  assert.strictEqual(
    newFile,
    normalizeFile([
      `module('New name', function (hooks) {`,
      `  module('Old name', function (nestedHooks) {});`,
      `});`,
      ``,
    ]),
  );
});
```

```ts [Example (Inorrect)]{6-11,20-25}
import { assert, test } from '@codemod-utils/tests';

import { renameModule } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | rename-module', function () {
  const oldFile = [
    `module('Old name', function (hooks) {`,
    `  module('Old name', function (nestedHooks) {});`,
    `});`,
    ``,
  ].join('\n');

  const newFile = renameModule(oldFile, {
    isTypeScript: true,
    moduleName: 'New name',
  });

  assert.strictEqual(
    newFile,
    [
      `module('New name', function (hooks) {`,
      `  module('Old name', function (nestedHooks) {});`,
      `});`,
      ``,
    ].join('\n'),
  );
});
```

:::

In some cases, making a test pass on Windows involves high cost and little reward. For example, `content-tag` (the underlying dependency of `@codemod-utils/ast-template-tag`) returns different indices for characters and lines on Windows. It's cumbersome to assert their values with a conditional branch, and to update these values manually when you change the input file or when `content-tag` makes a breaking change.

To run a test only on POSIX, consider writing a test helper.

::: code-group

```ts [tests/helpers/test-on-posix.ts]{8-10}
import { EOL } from 'node:os';

import { test } from '@codemod-utils/tests';

const onPosix = EOL === '\n';

export function testOnPosix(...parameters: Parameters<typeof test>): void {
  if (onPosix) {
    test(...parameters);
  }
}
```

```ts [Example (Before)]
import { assert, test } from '@codemod-utils/tests';

import { getClassToStyles } from '../../../../src/utils/css/index.js';

test('utils | css | get-class-to-styles', function () {
  /* ... */
});
```

```ts [Example (After)]
import { assert, normalizeFile } from '@codemod-utils/tests';

import { getClassToStyles } from '../../../../src/utils/css/index.js';
import { testOnPosix } from '../../../helpers/test-on-posix.js';

testOnPosix('utils | css | get-class-to-styles', function () {
  /* ... */
});
```

:::
