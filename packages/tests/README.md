[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/tests

_Utilities for tests_


## What is it?

`@codemod-utils/tests` wraps the methods from [`node:assert`](https://nodejs.org/api/assert.html) and [`@sondr3/minitest`](https://github.com/sondr3/minitest). It also provides methods to help you test file fixtures.

This means, you can:

- Write tests that execute fast
- Write tests that are "dependency-free"
- Thoroughly check the codemod's output


## API

### test, assert

Test files end in the extension `.test.js`. Whenever possible, each file has exactly 1 test and no more.

```js
import { assert, test } from '@codemod-utils/tests';

test('Some method', function () {
  /* Arrange, act, assert */
});
```

I find these assertions, which are "strong," to be useful for testing a codemod:

- `assert.deepStrictEqual` - check "complex" data structures (array, object, Map)
- `assert.strictEqual` - check "simple" data structures (Boolean, number, string)
- `assert.throws` - check error messages

You can append `.only()` to run a subset of tests.

```js
test('Some method', function () {
 // ...
}).only();
```


For more information, please check the documentations from [`node:assert`](https://nodejs.org/api/assert.html) and [`@sondr3/minitest`](https://github.com/sondr3/minitest).


### convertFixtureToJson, loadFixture, assertFixture

Use these methods to document how files are updated.

<details>

<summary>Example</summary>

```js
/* tests/fixtures/ember-container-query-glint/index.js */
import { convertFixtureToJson } from '@codemod-utils/tests';

const inputProject = convertFixtureToJson('ember-container-query-glint/input');
const outputProject = convertFixtureToJson('ember-container-query-glint/output');

export { inputProject, outputProject };
```

```js
/* tests/migration/ember-addon/index/ember-container-query/glint.test.js */
import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { migrateEmberAddon } from '../../../../../src/migration/ember-addon/index.js';
import {
  inputProject,
  outputProject,
} from '../../../../fixtures/ember-container-query-glint/index.js';

test('migration | ember-addon | index | ember-container-query > glint', function () {
  const codemodOptions = {
    addonLocation: undefined,
    projectRoot: 'tmp/ember-container-query-glint',
    testAppLocation: undefined,
    testAppName: undefined,
  };

  loadFixture(inputProject, codemodOptions);

  migrateEmberAddon(codemodOptions);

  assertFixture(outputProject, codemodOptions);

  // Check idempotence
  migrateEmberAddon(codemodOptions);

  assertFixture(outputProject, codemodOptions);
});
```

</details>

Note, `inputProject` and `outputProject` (obtained with `convertFixtureToJson` in the example above) are JSONs that represent the input and output directories. At times, it may be better to hardcode `inputProject` and `outputProject` in the test file, especially when only a few files need to be considered, or when the file content is not important.

To create the input and output directories easily, you can copy an existing project (assuming there is one). Then, run the codemod on the _output_ project.


## Compatibility

- Node.js v18 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
