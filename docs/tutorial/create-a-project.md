# Create a project

We can use `@codemod-utils/cli` (a command-line interface) to create a Node project. It comes with lint, test, CI (continuous integration), and documentation out of the box.

By default, the CLI installs `@codemod-utils/files` and `@codemod-utils/tests` (these packages are "core"), because every codemod will need them. For `ember-codemod-rename-tests`, we will want to update JS and TS files, so we will instruct the CLI to include `@codemod-utils/ast-javascript` (an "addon") as well.


## Goals

- Use `@codemod-utils/cli` to create a project
- Familiarize with folder structure


## Setup

Change the directory to a place where you like to keep projects. Then, run these commands:

```sh
# Create project
npx @codemod-utils/cli --name ember-codemod-rename-tests --addon ast-javascript

# Install dependencies
cd ember-codemod-rename-tests
pnpm install
```

Afterwards, you may commit the changes to a GitHub repo.

```sh
# Commit changes
git init
git add .
git commit -m "Initial commit"
```

```sh
# Push changes (to a new repo)
git remote add origin git@github.com:<your-github-handle>/<your-repo-name>.git
git branch -M main
git push -u origin main
```


## Folder structure

Let's take a look how the project is structured. For simplicity, the tree below only shows what's important for the tutorial.

```sh
ember-codemod-rename-tests
├── bin
│   └── ember-codemod-rename-tests.ts
├── src
│   ├── (blueprints)
│   ├── steps
│   ├── types
│   ├── (utils)
│   └── index.ts
└── tests
    ├── fixtures
    ├── helpers
    ├── index
    ├── steps
    └── (utils)
```


### bin

The `bin` folder has an **executable file**. This file allows your users ("end-developers") to run the codemod either with `npx`, or locally after they modify the clone of your repo.

```sh
# Compile TypeScript
pnpm build

# Run codemod
./dist/bin/ember-codemod-rename-tests.js --root <path/to/your/project>
```

It also means, you can test the codemod on a project on your local machine.

```sh
./dist/bin/ember-codemod-rename-tests.js --root ../../work-projects/client
```


### src

The `src` folder includes your **source code**.

While a Node project gives you lots of freedom in organizing files, `@codemod-utils` asks you to follow several conventions. This will help with debugging issues and migrating your project, should we discover better solutions in the future.

The following list looks like a lot, but no worries. The items will make more sense once you complete the tutorial.

- The main entry point is `src/index.ts`. So this file is a good place to start when you're studying another person's codemod.

    <details>

    <summary>Example: <code>src/index.ts</code></summary>

    ```ts
    export function runCodemod(codemodOptions: CodemodOptions): void {
      const options = createOptions(codemodOptions);

      // TODO: Replace with actual steps
      addEndOfLine(options);
    }
    ```

    </details>


- A codemod must break a large problem into small **steps**. Each step corresponds to exactly 1 file in the `src/steps` folder.

    In addition, each file (1) name-exports (2) a function that (3) has a name that describes the step well and (4) runs synchronously. In other words, we avoid premature abstractions and optimizations in favor of simplicity and reliability.

    <details>

    <summary>Example: <code>src/steps/add-end-of-line.ts</code></summary>

    ```ts
    export function addEndOfLine(options: Options): void {
      // ...
    }
    ```

    </details>

    The steps are re-exported in `src/steps/index.ts` so that `src/index.ts` (and tests) can easily consume them.

    <details>

    <summary>Example: <code>src/steps/index.ts</code></summary>

    ```ts
    export * from './add-end-of-line.js';
    export * from './create-options.js';
    ```

    </details>

- A step is encouraged to have smaller sub-steps, if it improves the project's maintability (fewer lines of code per file) and extensibility (group logically related steps). However, try to avoid premature abstractions.

    The sub-steps must live in a folder called `src/steps/<step-name>`, and may be re-exported in `src/steps/<step-name>/index.ts`. You will find an example of sub-steps towards the end of this tutorial.

- This tutorial doesn't cover **blueprints**, files that you can use like a "stamp" to create or update certain files in a project. Blueprints must live in the `src/blueprints` folder. The CLI will create this folder (along with a few other files) for you.

- You may extract "utility" functions from a step(s) so that you can write unit tests. However, try to avoid premature abstractions.

    The functions must live in the `src/utils` folder. Similarly to in an Ember project, you have some freedom in how you organize files inside this folder. You will find an example of **utilities** towards the end of this tutorial.


### tests

The `tests` folder includes your **tests**, **fixtures** (files that represent your end-consumer's project), and **test helpers** (things that help you write tests).

Again, there are some conventions:

- Similarly to in an Ember project, we write tests at the "acceptance," "integration," and "unit" levels. Broadly speaking, the tests in `tests/index`, `tests/steps`, and `tests/utils` correspond to these levels, respectively.

    For `tests/steps` and `tests/utils`, the folder structure should match that in the corresponding directory in `src`.

- Test files must have the file extension `*.test.ts`.

    Each file should have only 1 test, and each test only 1 assertion (with an exception for checking idempotency with two assertions). The goal is to write tests that are simple.

    <details>

    <summary>Example: <code>tests/steps/add-end-of-line/base-case.test.ts</code></summary>

    ```ts
    test('steps | add-end-of-line > base case', function () {
      const inputProject = {
        'file.txt': 'Hello world!',
      };

      const outputProject = {
        'file.txt': 'Hello world!\n',
      };

      loadFixture(inputProject, codemodOptions);

      addEndOfLine(options);

      assertFixture(outputProject, codemodOptions);
    });
    ```

    </details>

    You have some freedom in how you name tests. For example, you might use the `|` and `>` characters to follow the conventions from Ember and QUnit.

- Fixture files must live in the `tests/fixtures` folder.

    A fixture project for an acceptance test lives in the folder `tests/fixtures/<fixture-name>`, while that for an integration test in `tests/fixtures/steps/<test-case-name>`.

    <details>

    <summary>Example: <code>tests/fixtures/sample-project/index.ts</code></summary>

    ```ts
    import { convertFixtureToJson } from '@codemod-utils/tests';

    const inputProject = convertFixtureToJson('sample-project/input');
    const outputProject = convertFixtureToJson('sample-project/output');

    export { inputProject, outputProject };
    ```

    </details>

Note, the conventions for folder names may change in the future, so that we can simplify onboarding for people who have a background in Ember. The ideas (e.g. writing tests at different levels, using fixture files to test the codemod thoroughly) will remain the same.
