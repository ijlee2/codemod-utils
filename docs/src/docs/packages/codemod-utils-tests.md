# @codemod-utils/tests

_Utilities for tests_


## What is it?

`@codemod-utils/tests` helps you write tests for codemods.


## API

### assert {#api-assert}

The `assert` object comes from [Node.js](https://nodejs.org/docs/latest-v22.x/api/assert.html).

::: code-group

```ts [Example]
import { assert, test } from '@codemod-utils/tests';

import { createOptions } from '../../../src/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../helpers/shared-test-setups/sample-project.js';

test('steps | create-options > sample-project', function () {
  assert.deepStrictEqual(createOptions(codemodOptions), options);
});
```

:::

Make strong assertions whenever possible, by using [`assert.deepStrictEqual`](https://nodejs.org/docs/latest-v22.x/api/assert.html#assertdeepstrictequalactual-expected-message), [`assert.strictEqual`](https://nodejs.org/docs/latest-v22.x/api/assert.html#assertstrictequalactual-expected-message), and [`assert.throws`](https://nodejs.org/docs/latest-v22.x/api/assert.html#assertthrowsfn-error-message). Avoid weak assertions like [`assert.match`](https://nodejs.org/docs/latest-v22.x/api/assert.html#assertmatchstring-regexp-message) and [`assert.ok`](https://nodejs.org/docs/latest-v22.x/api/assert.html#assertokvalue-message), which create a "room for interpretation" and can make tests pass when they shouldn't (false negatives).

- `assert.deepStrictEqual` checks "complex" data structures (array, object, Map).
- `assert.strictEqual` checks "simple" data structures (Boolean, number, string).
- `assert.throws` checks error messages.


### assertFixture {#api-assert-fixture}

Asserts that the codemod updated the input project correctly.

Checks that all file names and contents specified in the `outputProject` (expected) match those in the updated input project (actual).

::: code-group

```ts [Signature]
/**
 * @param outputProject
 *
 * The folders and files that we expect to see, represented as a
 * JSON (possibly nested).
 *
 * The object keys are the folder and file names. The object values
 * are either a JSON (in the case of a folder key) or a string that
 * stores the file content (in the case of a file key).
 *
 * @param options
 *
 * An object with `projectRoot`. Here, `projectRoot` denotes where
 * we created the fixture for a test. (This is somewhere in the `tmp`
 * folder.)
 *
 * @return
 *
 * Returns `true`, if and only if, all folders and files are present
 * and all file contents are correct.
 */
function assertFixture(outputProject: DirJSON, options: Options): void;
```

```ts [Example]{15,20}
import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { runCodemod } from '../../src/index.js';
import {
  inputProject,
  outputProject,
} from '../fixtures/sample-project/index.js';
import { codemodOptions } from '../helpers/shared-test-setups/sample-project.js';

test('index > sample-project', function () {
  loadFixture(inputProject, codemodOptions);

  runCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);

  // Check idempotence
  runCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);
});
```

:::


### convertFixtureToJson {#api-convert-fixture-to-json}

Reads the fixture (folders and files) at the specified path. Returns a JSON representation for fixture-driven tests.

::: code-group

```ts [Signature]
/**
 * @param projectRoot
 *
 * Where the fixture can be found, relative to the `tests/fixtures`
 * folder in the codemod project.
 *
 * @return
 *
 * A JSON, which can then be passed to `loadFixture()` or
 * `assertFixture()`.
 */
function convertFixtureToJson(projectRoot: string): DirJSON;
```

```ts [Example] {3-4}
import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('sample-project/input');
const outputProject = convertFixtureToJson('sample-project/output');

export { inputProject, outputProject };
```

:::


### loadFixture {#api-load-fixture}

Creates a fixture (folders and files) at the specified path.

::: code-group

```ts [Signature]
/**
 * @param inputProject
 *
 * The folders and files that we want to create, represented as a
 * JSON (possibly nested).
 *
 * The object keys are the folder and file names. The object values
 * are either a JSON (in the case of a folder key) or a string that
 * stores the file content (in the case of a file key).
 *
 * @param options
 */
function loadFixture(inputProject: DirJSON, options: Options): void;
```

```ts [Example]{11}
import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { runCodemod } from '../../src/index.js';
import {
  inputProject,
  outputProject,
} from '../fixtures/sample-project/index.js';
import { codemodOptions } from '../helpers/shared-test-setups/sample-project.js';

test('index > sample-project', function () {
  loadFixture(inputProject, codemodOptions);

  runCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);

  // Check idempotence
  runCodemod(codemodOptions);

  assertFixture(outputProject, codemodOptions);
});
```

:::

> [!TIP]
>
> The example above showed an acceptance test, where `inputProject` and `outputProject` are derived from files that exist (somewhere in `/tests/fixtures`).
>
> For integration and unit tests, it may be better to bypass [`convertFixtureToJson`](#api-convert-fixture-to-json) and define `inputProject` and `outputProject` directly in the test file.
>
> ::: code-group
>
> ```ts [Example]
> test('steps | add-license > base case', function () {
>   const inputProject = {};
>
>   const outputProject = {
>     'LICENSE.md': 'The MIT License (MIT)',
>   };
>
>   loadFixture(inputProject, codemodOptions);
>
>   addLicense(options);
>
>   assertFixture(outputProject, codemodOptions);
> });
> ```
>
> :::


### normalizeFile {#api-normalize-file}

Creates a file (its content) with the correct newline character, so that a test can pass on both POSIX and Windows.

::: code-group

```ts [Signature]
/**
 * @param lines
 *
 * An array of texts.
 *
 * @return
 *
 * A string that represents the file content.
 */
function normalizeFile(lines: string[]): string;
```

```ts [Example]{4-9,15-24}
/**
 * Assert that `transform` correctly updates a file.
 */
const oldFile = normalizeFile([
  `import Component from '@glimmer/component';`,
  ``,
  `export default class Hello extends Component {}`,
  ``,
]);

const newFile = transform(oldFile);

assert.strictEqual(
  newFile,
  normalizeFile([
    `import Component from '@glimmer/component';`,
    ``,
    `import styles from './hello.module.css';`,
    ``,
    `export default class Hello extends Component {`,
    `  styles = styles;`,
    `}`,
    ``,
  ]),
);
```

:::


### test {#api-test}

The `test` method comes from [`@sondr3/minitest`](https://github.com/sondr3/minitest).

::: code-group

```ts [Example]{3}
import { test } from '@codemod-utils/tests';

test('index > sample-project', function () {
  // ...
});
```

:::

> [!IMPORTANT]
> 
> A test file must have the extension `.test.ts` or `.test.js`.

You can append `.ignore()` or `.only()` to run a subset of tests. This may be useful for developing a feature or debugging an issue.

::: code-group

```ts [How to skip a test]{3}
test('index > sample-project', function () {
  // ...
}).ignore();
```

```ts [How to run only the test]{3}
test('index > sample-project', function () {
  // ...
}).only();
```

:::
