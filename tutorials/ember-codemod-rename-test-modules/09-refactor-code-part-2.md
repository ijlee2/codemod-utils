# Refactor code (Part 2)

In [the previous chapter](./08-refactor-code-part-1.md), we wrote a step called `rename-tests` and extracted a couple of utilities. Before we call the codemod done, we'll write integration and unit tests to document their inputs and outputs.


Goals:

- Write integration tests
- Write unit tests


## Write integration tests

Recall from [Chapter 2](02-understand-the-folder-structure.md#tests) that tests for the steps live in the `tests/steps` folder. These tests are analogous to the integration tests that we write for components, helpers, and modifiers in Ember. The folder structure for `tests/steps` should match that for `src/steps`.

For steps like `rename-tests`, where files are read and updated, we can take one of two approaches:

- Store fixture projects in `tests/fixtures/steps/<step-name>`.
- Hard-code the fixture projects as JSONs in tests (preferred if a project is simple).

The fixture projects for integration tests are allowed to be different (even simplified) from those for acceptance tests. For each step, we can also create multiple fixture projects so that the project names clearly indicate what is being tested. A related idea is forming a [basis](https://crunchingnumbers.live/2019/10/11/write-tests-like-a-mathematician-part-3/), i.e. finding a minimum set of tests that can check the step thoroughly.

To test `rename-tests`, we will create 3 projects:

- `edge-cases` (edge cases)
- `javascript` (base cases with JavaScript files)
- `typescript` (base cases with TypeScript files)

The `javascript` and `typescript` projects will cover different entity types, but they won't cover _all_ because we already have a good acceptance test and will later write unit tests. To create the projects, please cherry-pick the commit `chore: Added fixtures (rename-tests)` from [my solution repo](https://github.com/ijlee2/ember-codemod-rename-test-modules/commits/main).

```sh
git remote add solution git@github.com:ijlee2/ember-codemod-rename-test-modules.git
git fetch solution
git cherry-pick 9e1c417
git remote remove solution
```

Create the file `tests/steps/rename-tests/javascript.test.ts`, then copy-paste the following starter code.

<details>

<summary>Starter code</code></summary>

```ts
import {
  assertFixture,
  convertFixtureToJson,
  loadFixture,
  test,
} from '@codemod-utils/tests';

import { renameTests } from '../../../src/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../helpers/shared-test-setups/sample-project.js';

test('steps | rename-tests > javascript', function () {
  const inputProject = convertFixtureToJson(
    'steps/rename-tests/javascript/input',
  );

  const outputProject = convertFixtureToJson(
    'steps/rename-tests/javascript/output',
  );

  loadFixture(inputProject, codemodOptions);

  renameTests(options);

  assertFixture(outputProject, codemodOptions);
});
```

</details>

A few remarks:

- `convertFixtureToJson()` assumes that fixture projects are located in `tests/fixtures`. That's why we provide the relative paths `steps/rename-tests/javascript/input` and `steps/rename-tests/javascript/output`.

- We see the **Arrange-Act-Assert** (AAA, "triple-A") testing pattern.

    ```ts
    // Arrange
    loadFixture(inputProject, codemodOptions);

    // Act
    renameTests(options);

    // Assert
    assertFixture(outputProject, codemodOptions);
    ```

- The `codemodOptions` and `options` are really meant for the project named `sample-project`. We reused them for the `javascript` project out of convenience in this tutorial. For your actual codemod project, please use the right ones so that your tests run under the correct assumptions.

It's now your turn. Use the other 2 projects to write two more tests.

<details>

<summary>Solution: <code>tests/steps/rename-tests/edge-cases.test.ts</code></summary>

```diff
import {
  assertFixture,
  convertFixtureToJson,
  loadFixture,
  test,
} from '@codemod-utils/tests';

import { renameTests } from '../../../src/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../helpers/shared-test-setups/sample-project.js';

- test('steps | rename-tests > javascript', function () {
+ test('steps | rename-tests > edge-cases', function () {
  const inputProject = convertFixtureToJson(
-     'steps/rename-tests/javascript/input',
+     'steps/rename-tests/edge-cases/input',
  );

  const outputProject = convertFixtureToJson(
-     'steps/rename-tests/javascript/output',
+     'steps/rename-tests/edge-cases/output',
  );

  loadFixture(inputProject, codemodOptions);

  renameTests(options);

  assertFixture(outputProject, codemodOptions);
});
```

</details>

<details>

<summary>Solution: <code>tests/steps/rename-tests/typescript.test.ts</code></summary>

```diff
import {
  assertFixture,
  convertFixtureToJson,
  loadFixture,
  test,
} from '@codemod-utils/tests';

import { renameTests } from '../../../src/steps/index.js';
import {
  codemodOptions,
  options,
} from '../../helpers/shared-test-setups/sample-project.js';

- test('steps | rename-tests > javascript', function () {
+ test('steps | rename-tests > typescript', function () {
  const inputProject = convertFixtureToJson(
-     'steps/rename-tests/javascript/input',
+     'steps/rename-tests/typescript/input',
  );

  const outputProject = convertFixtureToJson(
-     'steps/rename-tests/javascript/output',
+     'steps/rename-tests/typescript/output',
  );

  loadFixture(inputProject, codemodOptions);

  renameTests(options);

  assertFixture(outputProject, codemodOptions);
});
```

</details>


## Write unit tests

Recall from [Chapter 2](02-understand-the-folder-structure.md#tests) that tests for the utilities live in the `tests/utils` folder. These tests are analogous to the unit tests that we write for utilities in Ember. The folder structure for `tests/utils` should match that for `src/utils`.

In the previous chapter, we extracted 2 utilities: `renameModule()` and `parseEntity()`. To show you how to write unit tests, I will walk you through `renameModule()`, then let you write tests for `parseEntity()`.


### renameModule()

Let's check the base case for a JavaScript file. Create the file `tests/utils/rename-tests/rename-module/javascript.test.ts`, then copy-paste the following starter code.

<details>

<summary>Starter code</code></summary>

```ts
import { assert, test } from '@codemod-utils/tests';

import { renameModule } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | rename-module > javascript', function () {
  const oldFile = `module('Old name', function (hooks) {});\n`;

  const newFile = renameModule(oldFile, {
    isTypeScript: false,
    moduleName: 'New name',
  });

  assert.strictEqual(newFile, `module('New name', function (hooks) {});\n`);
});
```

</details>

A few remarks:

- We see the AAA pattern again.

    ```ts
    // Arrange
    const oldFile = `module('Old name', function (hooks) {});\n`;

    // Act
    const newFile = renameModule(oldFile, {
      isTypeScript: false,
      moduleName: 'New name',
    });

    // Assert
    assert.strictEqual(newFile, `module('New name', function (hooks) {});\n`);
    ```

- Although the implementation for `renameModule()` is complex (we had to parse and update abstract syntax trees), the test for it is simple, because `renameModule()` provided a good interface. 

- The input and output files were simple enough that we could write their content in one line without sacrificing readability. Should they have many lines, create an array of strings and use the `join()` method instead. This way, you can simulate what one would see in an actual file.

    ```ts
    const oldFile = [
      `module('Old name', function (hooks) {`,
      `  module('Old name', function (nestedHooks) {});`,
      `});`,
      ``,
    ].join('\n');

    // ...

    assert.strictEqual(
      newFile,
      [
        `module('New name', function (hooks) {`,
        `  module('Old name', function (nestedHooks) {});`,
        `});`,
        ``,
      ].join('\n'),
    );
    ```

See if you can write 5 more tests:

- A base case for a TypeScript file
- An edge case, where the file is empty
- An edge case, where `module()` does not exist
- An edge case, where `module()` has incorrect arguments (e.g. the 2nd argument is missing)
- An edge case with nested modules

<details>

<summary>Solution: <code>tests/utils/rename-tests/rename-module/typescript.test.ts</code></summary>

This test checks that `renameModule()` can handle TypeScript files.

```ts
import { assert, test } from '@codemod-utils/tests';

import { renameModule } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | rename-module > typescript', function () {
  const oldFile = `module('Old name', function (hooks) {});\n`;

  const newFile = renameModule(oldFile, {
    isTypeScript: true,
    moduleName: 'New name',
  });

  assert.strictEqual(newFile, `module('New name', function (hooks) {});\n`);
});
```

</details>

<details>

<summary>Solution: <code>tests/utils/rename-tests/rename-module/edge-case-file-is-empty.test.ts</code></summary>

This test checks that, when the file is empty, `renameModule()` returns the same file content and doesn't run into an error.

```ts
import { assert, test } from '@codemod-utils/tests';

import { renameModule } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | rename-module > edge case (file is empty)', function () {
  const oldFile = '';

  const newFile = renameModule(oldFile, {
    isTypeScript: true,
    moduleName: 'New name',
  });

  assert.strictEqual(newFile, '');
});
```

</details>

<details>

<summary>Solution: <code>tests/utils/rename-tests/rename-module/edge-case-module-does-not-exist.test.ts</code></summary>

This test checks that, when the file doesn't have a `module()` call, `renameModule()` returns the same file content and doesn't run into an error.

```ts
import { assert, test } from '@codemod-utils/tests';

import { renameModule } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | rename-module > edge case (module does not exist)', function () {
  const oldFile = `test('Old name', function (assert) {});\n`;

  const newFile = renameModule(oldFile, {
    isTypeScript: true,
    moduleName: 'New name',
  });

  assert.strictEqual(newFile, `test('Old name', function (assert) {});\n`);
});
```

</details>

<details>

<summary>Solution: <code>tests/utils/rename-tests/rename-module/edge-case-module-has-incorrect-arguments.test.ts</code></summary>

This test checks that, when the `module()` call is incorrect, `renameModule()` returns the same file content and doesn't run into an error.

```ts
import { assert, test } from '@codemod-utils/tests';

import { renameModule } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | rename-module > edge case (module has incorrect arguments)', function () {
  const oldFile = `module('Old name');\n`;

  const newFile = renameModule(oldFile, {
    isTypeScript: true,
    moduleName: 'New name',
  });

  assert.strictEqual(newFile, `module('Old name');\n`);
});
```

</details>

<details>

<summary>Solution: <code>tests/utils/rename-tests/rename-module/edge-case-nested-modules.test.ts</code></summary>

This test checks that `renameModule()` renames only the parent module.

```ts
import { assert, test } from '@codemod-utils/tests';

import { renameModule } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | rename-module > edge case (nested modules)', function () {
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

</details>


### parseEntity()

See if you can write unit tests for `parseEntity()`. Since the function returns an object, a data structure that is "complex," you will want to use `assert.deepStrictEqual()` to make an assertion.

- A base case where the entity type is known
- An edge case where the entity type is unknown

<details>

<summary>Solution: <code>tests/utils/rename-tests/parse-entity/base-case.test.ts</code></summary>

```ts
import { assert, test } from '@codemod-utils/tests';

import { parseEntity } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | parse-entity > base case', function () {
  const folderToEntityType = new Map([
    ['components', 'Component'],
    ['helpers', 'Helper'],
    ['modifiers', 'Modifier'],
  ]);

  const output = parseEntity('components/ui/form', folderToEntityType);

  assert.deepStrictEqual(output, {
    entityType: 'Component',
    remainingPath: 'ui/form',
  });
});
```

</details>

<details>

<summary>Solution: <code>tests/utils/rename-tests/parse-entity/edge-case-entity-type-is-unknown.test.ts</code></summary>

```ts
import { assert, test } from '@codemod-utils/tests';

import { parseEntity } from '../../../../src/utils/rename-tests/index.js';

test('utils | rename-tests | parse-entity > edge case (entity type is unknown)', function () {
  const folderToEntityType = new Map([
    ['adapters', 'Adapter'],
    ['controllers', 'Controller'],
    ['initializers', 'Initializer'],
    ['instance-initializers', 'Instance Initializer'],
    ['mixins', 'Mixin'],
    ['models', 'Model'],
    ['routes', 'Route'],
    ['serializers', 'Serializer'],
    ['services', 'Service'],
    ['utils', 'Utility'],
  ]);

  const output = parseEntity('resources/remote-data', folderToEntityType);

  assert.deepStrictEqual(output, {
    entityType: undefined,
    remainingPath: 'resources/remote-data',
  });
});
```

</details>

Note that `dir` and `folderToEntityType`, the test setup for `parseEntity()`, show "realistic" values to help with documentation. In general, avoid values like `'foo'`, `'bar'`, and `1`, which can't clearly indicate to all contributors what the function needs.


<div align="center">
  <div>
    Next: TBA
  </div>
  <div>
    Previous: <a href="./08-refactor-code-part-1.md">Refactor code (Part 1)</a>
  </div>
</div>
