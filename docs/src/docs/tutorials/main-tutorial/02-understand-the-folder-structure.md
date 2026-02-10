# Understand the folder structure

Recall from [the previous chapter](./01-create-a-project) that `@codemod-utils/cli` creates a Node project. 

While Node gives you lots of freedom in organizing files, `codemod-utils` asks you to follow several conventions. This will help with debugging issues and migrating your project, should we discover better approaches in the future.

Goals:

- Familiarize with the folder structure
- Familiarize with conventions from `codemod-utils`


## Folder structure

Let's take a look at how `ember-codemod-rename-test-modules` is structured as a tree. For simplicity, the tree only shows what's important for the tutorial.

```sh {:no-line-numbers}
ember-codemod-rename-test-modules
├── bin
│   └── ember-codemod-rename-test-modules.ts
├── src
│   ├── (blueprints)
│   ├── steps
│   ├── types
│   ├── (utils)
│   └── index.ts
├── tests
│   ├── fixtures
│   ├── helpers
│   ├── index
│   ├── steps
│   └── (utils)
└── update-test-fixtures.sh

# Hidden: dist, dist-for-testing, tmp
```


### bin {#folder-structure-bin}

The `bin` folder has an **executable file**. This file allows end-developers to run the codemod either with `pnpx`, or locally after they modify the clone of your repo.

```sh {:no-line-numbers}
# Compile TypeScript
pnpm build

# Run codemod
./dist/bin/ember-codemod-rename-test-modules.js --root <path/to/your/project>
```

It also means, you can test the codemod on a project on your local machine.

```sh {:no-line-numbers}
./dist/bin/ember-codemod-rename-test-modules.js --root ../../work-projects/client
```


### src {#folder-structure-src}

The `src` folder includes your **source code**.

The following list, which explains the `src` folder in detail, has many items. But no worries, they will make more sense once you complete the tutorial.

- The main entry point is `src/index.ts`. This file is a good place to start when studying another person's codemod.

    <details>

    <summary>Example</summary>

    By default, the codemod logs the available options.

    ::: code-group

    ```ts [src/index.ts]{4-5}
    export function runCodemod(codemodOptions: CodemodOptions): void {
      const options = createOptions(codemodOptions);

      // TODO: Replace with actual steps
      console.log(options);
    }
    ```

    :::

    </details>


- A codemod must break a large problem into small **steps**. Each step corresponds to exactly 1 file in the `src/steps` folder.

    In addition, each file (1) name-exports (2) a function that (3) has a descriptive name and (4) runs synchronously. In other words, we avoid premature abstractions and optimizations in favor of simplicity and reliability.

    <details>

    <summary>Example</summary>

    The `create-options` step is represented by a function. It transforms the codemod's CLI options into something that helps us write the codemod. The function runs synchronously so its return type is `Options`, not `Promise<Options>`.

    ::: code-group

    ```ts [src/steps/create-options.ts]{3}
    import type { CodemodOptions, Options } from '../types/index.js';

    export function createOptions(codemodOptions: CodemodOptions): Options {
      // ...
    }
    ```

    :::

    </details>

    The steps are re-exported in `src/steps/index.ts` so that `src/index.ts` (and tests) can easily consume them.

    <details>

    <summary>Example</summary>

    Due to linter configurations, the export statements must be sorted by file path. No worries, you can run the `lint:fix` script to auto-fix the order. In addition, the exported functions (the steps) must have a unique name.

    ::: code-group

    ```ts [src/steps/index.ts]{1}
    export * from './create-options.js';
    ```

    :::

    </details>

- A step is encouraged to have smaller substeps (substeps are also functions), if it improves the project's maintainability (fewer lines of code per file) and extensibility (group logically related steps). However, do try to avoid premature abstractions.

    A substep lives in `src/steps/<step-name>/<substep-name>.ts`. It may be re-exported in `src/steps/<step-name>/index.ts`.

    You will find an example of breaking a step into smaller steps in [Chapter 8](./08-refactor-code-part-1#split-a-step-into-substeps).

- This tutorial doesn't cover **blueprints**, files that you can use like a "stamp" to create or update certain files in a project. Blueprints must live in the `src/blueprints` folder. The CLI will create this folder (along with a few other files) for you.

- You may extract **utilities** (e.g. data, functions) from a step so that you can write unit tests. However, do try to avoid premature abstractions.

    Utilities must live in the `src/utils` folder. Similarly to in an Ember project, you have some freedom in how you organize files inside this folder.

    You will find examples of utilities in [Chapter 8](./08-refactor-code-part-1#extract-utilities).


### tests {#folder-structure-tests}

The `tests` folder includes your **tests**, **fixtures** (files that represent your end-developer's project), and **test helpers** (things that help you write tests).

Again, there are some conventions:

- Test files must have the file extension `*.test.ts`.

    Each file should have only 1 test, and each test only 1 assertion (unless when we check **idempotence** with 2 assertions in a test.) The goal is to write tests that are simple.

    <details>

    <summary>Example</summary>

    This test, which runs the codemod like end-developers would, asserts idempotence (also called idempotency). If a codemod is idempotent, then the updated files are guaranteed to remain the same when the codemod is run again.

    ::: code-group

    ```ts [tests/index/sample-project.test.ts]{8,13}
    import { runCodemod } from '../../src/index.js';

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

    `loadFixture` and `assertFixture` help us test the codemod against real files, which has two benefits. One, we can make a **strong** (a terminology from math) assertion that `runCodemod` works. Two, we can read files easily because our code editor can highlight the syntax.

    </details>

- You have some freedom in the name that you provide to the `test` method. There is no analogue of QUnit's `module` method so you might use, for example, the characters `|` and `>` to document that a group of tests is related.

- Like in an Ember project, we write tests at the "acceptance," "integration," and "unit" levels. Broadly speaking, the tests in `/tests/index`, `/tests/steps`, and `/tests/utils` match these levels, respectively.

    The folder structure for `/tests/steps` should match that for `/src/steps`. The same goes for `/tests/utils` and `/src/utils`.

    You will write integration and unit tests in [Chapter 9](./09-refactor-code-part-2).

- Writing tests for substeps is _discouraged_. Instead, write tests for the parent step (integration) or for the related utilities (unit). By doing so, we can easily change substeps (often, an implementation detail) in the future.

- Fixture files must live in the `tests/fixtures` folder.

    A fixture project for an acceptance test lives in the folder `tests/fixtures/<fixture-name>`, while that for an integration test in `tests/fixtures/steps/<test-case-name>`.

    <details>

    <summary>Example</summary>

    `convertFixtureToJson` reads a project (often, a deeply nested folder of files) and returns a JSON. We can then pass the JSON to `loadFixture` and `assertFixture`.

    ::: code-group

    ```ts [tests/fixtures/sample-project/index.ts]{3-4}
    import { convertFixtureToJson } from '@codemod-utils/tests';

    const inputProject = convertFixtureToJson('sample-project/input');
    const outputProject = convertFixtureToJson('sample-project/output');

    export { inputProject, outputProject };
    ```

    :::

    </details>

- Test helpers must live in the `tests/helpers` folder.

    <details>

    <summary>Example</summary>

    Almost every step needs `codemodOptions` or `options`. To help with writing tests, we can define these two for each fixture project.

    ::: code-group

    ```ts [tests/helpers/shared-test-setups/sample-project.ts]{3-9}
    import type { CodemodOptions, Options } from '../../../src/types/index.js';

    const codemodOptions: CodemodOptions = {
      projectRoot: 'tmp/sample-project',
    };

    const options: Options = {
      projectRoot: 'tmp/sample-project',
    };

    export { codemodOptions, options };
    ```

    :::

    </details>


### dist, dist-for-testing, tmp {#folder-structure-dist-dist-for-testing-tmp}

To run the codemod (written in TypeScript), it must be compiled to JavaScript first.

Running the `build` script (re)creates the `dist` folder. The files in this folder are what is shipped to end-developers.

Running the `test` script (re)creates the `dist-for-testing` folder. The files in this folder are what is tested. The fixture files are copied to the `tmp` folder.


### update-test-fixtures.sh {#folder-structure-update-test-fixtures-sh}

Acceptance tests will likely fail after you create or update a step. The script `update-test-fixtures.sh` updates the fixture files for each output project so that the acceptance tests will pass.

```sh {:no-line-numbers}
# From the root
./update-test-fixtures.sh
```

> [!NOTE]
> 
> `update-test-fixtures.sh` doesn't update fixture files for steps (i.e. fixture files for integration tests), since the steps may have an order dependency. You will need to update them manually.

The recommended workflow is:

1. Create or update a step.
1. Commit the code change.
1. Run `update-test-fixtures.sh`.
1. Commit the code change.

This way, the second commit shows the effect of your code change.
