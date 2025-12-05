[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/tests

_Utilities for tests_


## What is it?

`@codemod-utils/tests` helps you write fixture-driven tests. The tests execute fast and are "dependency-free."


## API

### assert

The `assert` object comes from [Node.js](https://nodejs.org/api/assert.html).

```ts
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

Make strong assertions whenever possible, using methods such as [`assert.deepStrictEqual()`](https://nodejs.org/docs/latest-v18.x/api/assert.html#assertdeepstrictequalactual-expected-message), [`assert.strictEqual()`](https://nodejs.org/docs/latest-v18.x/api/assert.html#assertstrictequalactual-expected-message), and [`assert.throws()`](https://nodejs.org/docs/latest-v18.x/api/assert.html#assertthrowsfn-error-message). Weak assertions like [`assert.match()`](https://nodejs.org/docs/latest-v18.x/api/assert.html#assertmatchstring-regexp-message) and [`assert.ok()`](https://nodejs.org/docs/latest-v18.x/api/assert.html#assertokvalue-message), which create a "room for interpretation" and can make tests pass when they shouldn't (false negatives), should be avoided.

- `assert.deepStrictEqual()` - check "complex" data structures (array, object, Map)
- `assert.strictEqual()` - check "simple" data structures (Boolean, number, string)
- `assert.throws()` - check error messages


### assertFixture, convertFixtureToJson, loadFixture

Use these methods to document how the codemod updates folders and files.

<details>

<summary>Example</summary>

```ts
/* tests/fixtures/sample-project/index.ts */
import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('sample-project/input');
const outputProject = convertFixtureToJson('sample-project/output');

export { inputProject, outputProject };
```

```ts
/* tests/index/sample-project.test.ts */
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

</details>

In the example above (an "acceptance" test), `inputProject` and `outputProject` were derived from folders and files that actually exist. At times, it may be easier to define `inputProject` and `outputProject` in the test file. This is often the case for "integration" tests, i.e. tests for a single step. Maybe only a few types of files need to be checked, or the file content can be empty because it plays no role in the step.


### normalizeFile

`normalizeFile()` helps you create a file (its content) with the correct newline character, so that a test can pass on both POSIX and Windows.

<details>

<summary>Example</summary>

```ts
const oldFile = createFile([
  `import Component from '@glimmer/component';`,
  ``,
  `export default class Hello extends Component {}`,
  ``,
]);

const newFile = transform(oldFile);

assert.strictEqual(
  newFile,
  createFile([
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

</details>


### test

The `test()` method comes from [`@sondr3/minitest`](https://github.com/sondr3/minitest).

```ts
import { test } from '@codemod-utils/tests';

test('index > sample-project', function () {
  // ...
});
```

You can append `.ignore()` or `.only()` to run a subset of tests. This may be useful for debugging.

```ts
test('index > sample-project', function () {
  // ...
}).ignore();

test('index > sample-project', function () {
  // ...
}).only();
```

Note, test files must have the extension `.test.ts` or `.test.js`. Check the [main tutorial](../../tutorials/main-tutorial/02-understand-the-folder-structure.md#tests) for conventions around tests.


## Compatibility

- Node.js v20 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
