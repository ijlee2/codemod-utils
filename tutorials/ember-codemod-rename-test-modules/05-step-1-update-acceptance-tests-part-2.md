# Step 1: Update acceptance tests (Part 2)

At [the end of the last chapter](./04-step-1-update-acceptance-tests-part-1.md#extract-function), we extracted a function called `renameModule()`. It received an input file (a file that may or may not be a valid acceptance test) and returned it unchanged.

```ts
function renameModule(file: string): string {
  return file;
}
```

In this chapter, we'll instruct this function to update the file (if it is valid) by renaming the test module. We'll use `@codemod-utils/ast-javascript` to parse and transform the file.

Goals:

- Use AST explorer as a playground
- Use `@codemod-utils/ast-javascript` to read and update files
- Make early exits
- Auto-fix fixtures


## Hello, AST!

Libraries like [`recast`](https://github.com/benjamn/recast) and [`ember-template-recast`](https://github.com/ember-template-lint/ember-template-recast) help us convert JS/TS and HBS files to an **AST (abstract syntax tree)**. `@codemod-utils` wraps these libraries to provide you an interface that is standardized:

- `AST.traverse` (traverse the tree)
- `AST.builders` (build a new tree)
- `AST.print` (convert the tree to a file)

<details>

<summary>How to use <code>@codemod-utils/ast-javascript</code></summary>

```ts
import { AST } from '@codemod-utils/ast-javascript';

function updateFile(file: string, isTypeScript: boolean): string {
  const traverse = AST.traverse(isTypeScript);

  const ast = traverse(file, {
    /* Use AST.builders to transform the tree */
  });

  return AST.print(ast);
}
```

</details>

<details>

<summary>How to use <code>@codemod-utils/ast-template</code></summary>

```ts
import { AST } from '@codemod-utils/ast-template';

function updateFile(file: string): string {
  const traverse = AST.traverse();

  const ast = traverse(file, {
    /* Use AST.builders to transform the tree */
  });

  return AST.print(ast);
}
```

</details>

Based on the how-to's above, try updating `renameModule()`. It is to remain an identity function, but to now use `AST.traverse` and `AST.print`, in order to read the file and return it unchanged. How will you indicate whether a file is in JavaScript or TypeScript?

<details>

We pass another argument called `data` to `renameModule()`. It is an object that contains any additional information that we need to read and update the file.

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

+ import { AST } from '@codemod-utils/ast-javascript';
import { findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

- function renameModule(file: string): string {
-   return file;
- }
+ type Data = {
+   isTypeScript: boolean;
+ };
+ 
+ function renameModule(file: string, data: Data): string {
+   const traverse = AST.traverse(data.isTypeScript);
+ 
+   const ast = traverse(file, {
+     // ...
+   });
+ 
+   return AST.print(ast);
+ }

export function renameAcceptanceTests(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('tests/acceptance/**/*-test.{js,ts}', {
    projectRoot,
  });

  filePaths.forEach((filePath) => {
    const oldPath = join(projectRoot, filePath);
    const oldFile = readFileSync(oldPath, 'utf8');

-     const newFile = renameModule(oldFile);
+     const data = {
+       isTypeScript: filePath.endsWith('.ts'),
+     };
+ 
+     const newFile = renameModule(oldFile, data);

    writeFileSync(oldPath, newFile, 'utf8');
  });
}
```

</details>

Since `renameModule()` is an identity, the `test` script should continue to pass.


## AST Explorer

Next, we want to specify how to update the tree (how to rename the test module).

```ts
const ast = traverse(file, {
  // ...
});
```

Currently, `ember-template-recast` and `recast` lack documentation and tutorials. This is unfortunate, given the large amount of **builders** and **visit methods** that they provide to help you transform code.

We will use [AST Explorer](https://astexplorer.net) to test a small piece of code and familiarize with the API. The error messages from TypeScript, which you can find in your browser's console, can sometimes help.


### Setup

Select the following options to create a 4-tab window:

- Language: `JavaScript`
- Parser: `recast`
- Transform: `recast`

Then, copy-paste the following code:

<details>

<summary>Input file (top-left corner)</summary>

A simplified file that covers the base and edge cases, while ignoring the things that are unimportant.

```ts
import { module, test } from 'qunit';

module('Acceptance | forms', function (hooks) {
  test('Accessibility audit', async function (assert) {});

  module('subscribe-to-ember-times, control', function (nestedHooks) {
    test('A user can visit the form route', async function (assert) {});
  });

  module('subscribe-to-ember-times, v1', function (nestedHooks) {
    test('A user can visit the form route', async function (assert) {});
  });
});
```

</details>

<details>

<summary>Transform function (bottom-left corner)</summary>

```ts
export default function transformer(code, { recast, parsers }) {
  const ast = recast.parse(code, { parser: parsers.typescript });
  const b = recast.types.builders;

  console.log(ast.program.body);

  recast.visit(ast, {
    // ...
  });

  return recast.print(ast).code;
}
```

</details>


### Visit methods

From the console, we see that `ast.program.body` (the input file) is an array with 2 elements (called **nodes**, in the context of a tree). The nodes correspond to the `import` statement on line 1 and the `module()` function on line 3.

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/0e028238-3f7b-4b53-911d-c2717345d682">

Since we are interested in updating `module()`, we expand the 2nd element to find things that can help us. We see that there are 3 node `type`'s associated with `module()`:

- `ExpressionStatement`
- `CallExpression`
- `Identifier`

It's a game of Goldilocks: We have to pick one that provides us enough information to rename the test module, but not too much that reading and updating the information becomes difficult. The one that's just right is `CallExpression`. From the `type`'s name, we can guess the visit method's name to be `visitCallExpression()`.

```ts
recast.visit(ast, {
  visitCallExpression(node) {
    // ...
  },
});
```

To better understand this visit method, use `console.log()` to check the value of `node.value`. The error message in the console tells us what `visitCallExpression()` should return.

<details>

<summary>Solution: Transform function</summary>

```diff
export default function transformer(code, { recast, parsers }) {
  const ast = recast.parse(code, { parser: parsers.typescript });
  const b = recast.types.builders;

  recast.visit(ast, {
-     // ...
+     visitCallExpression(node) {
+       console.log('-- CallExpression --');
+       console.log(node.value);
+ 
+       return false;
+     },
  });

  return recast.print(ast).code;
}
```

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/9a90afd3-59e3-4e6d-9cdf-e5f506ab1ab3">

</details>

From the console log, we see that `visitCallExpression()` visited only 1 node. This is surprising, because the `test()` and `module()` functions, located inside the parent `module()`, are also of the type `CallExpression`. This works in our favor, but may be a bug in some other case. To visit all `CallExpression` nodes, you can write `this.traverse(node)` to make a recursion.

<details>

<summary>Example</summary>

```ts
recast.visit(ast, {
  visitCallExpression(node) {
    this.traverse(node);

    // ...

    return false;
  },
});
```

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/d6be07b3-8537-493c-9e68-a0c600d85f38">

</details>


### Make early exits

Early exits are key to traversing a tree in a way that is maintainable and extensible. Without early exits, TypeScript will likely throw an error when you access a nested property of `node` (because you made too many assumptions).

Recall the logs in the console from earlier:

<details>

<summary>Screenshots</summary>

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/0e028238-3f7b-4b53-911d-c2717345d682">

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/9a90afd3-59e3-4e6d-9cdf-e5f506ab1ab3">

</details>

Use what are highlighted in orange (`node.value.callee` and `node.value.arguments`) to make early exits. If done correctly, you will continue to see the node for the parent `module()` in the console. As soon as `module()` is renamed or has incorrect arguments, the node will disappear from the console.

<details>

<summary>Solution: Transform function</summary>

An extra check `node.value.arguments[0].type !== 'Literal'` is needed for JavaScript files. Apparently, the `type` is `Literal` for JS and `StringLiteral` for TS? 😓

```diff
export default function transformer(code, { recast, parsers }) {
  const ast = recast.parse(code, { parser: parsers.typescript });
  const b = recast.types.builders;

  recast.visit(ast, {
    visitCallExpression(node) {
+       if (
+         node.value.callee.type !== 'Identifier' ||
+         node.value.callee.name !== 'module'
+       ) {
+         return false;
+       }
+ 
+       if (node.value.arguments.length !== 2) {
+         return false;
+       }
+ 
+       if (
+         node.value.arguments[0].type !== 'Literal' &&
+         node.value.arguments[0].type !== 'StringLiteral'
+       ) {
+         return false;
+       }
+ 
      console.log('-- CallExpression --');
      console.log(node.value);

      return false;
    },
  });

  return recast.print(ast).code;
}
```

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/0605769e-5327-43a0-bd02-daed2ce62bad">

</details>

Thanks to early exits, files that aren't valid test files won't be changed.


### Build a new tree

Now that we've isolated the valid case, we can use `b.stringLiteral()` (a builder) to replace a part of the tree, i.e. to rename the test module.

Again, try using the error message in the console to find out how to update the tree. (This is not easy!) If done correctly, the output file at the bottom-right corner will show a new name for the test module.

<details>

<summary>Solution: Transform function</summary>

```diff
export default function transformer(code, { recast, parsers }) {
  const ast = recast.parse(code, { parser: parsers.typescript });
  const b = recast.types.builders;

+   const moduleName = 'New name';
+ 
  recast.visit(ast, {
    visitCallExpression(node) {
      if (
        node.value.callee.type !== 'Identifier' ||
        node.value.callee.name !== 'module'
      ) {
        return false;
      }

      if (node.value.arguments.length !== 2) {
        return false;
      }

      if (
        node.value.arguments[0].type !== 'Literal' &&
        node.value.arguments[0].type !== 'StringLiteral'
      ) {
        return false;
      }
 
-       console.log('-- CallExpression --');
-       console.log(node.value);
+       node.value.arguments[0] = b.stringLiteral(moduleName);

      return false;
    },
  });

  return recast.print(ast).code;
}
```

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/02ee5604-25d8-4ea3-9fc7-8731524851b5">

</details>

To be precise about types, we can use a `switch` statement and refactor code.

<details>

<summary>Solution: Transform function</summary>

```diff
export default function transformer(code, { recast, parsers }) {
  const ast = recast.parse(code, { parser: parsers.typescript });
  const b = recast.types.builders;
  
  const moduleName = 'New name';

  recast.visit(ast, {
    visitCallExpression(node) {
      if (
        node.value.callee.type !== 'Identifier' ||
        node.value.callee.name !== 'module'
      ) {
        return false;
      }

      if (node.value.arguments.length !== 2) {
        return false;
      }

-       if (
-         node.value.arguments[0].type !== 'Literal' &&
-         node.value.arguments[0].type !== 'StringLiteral'
-       ) {
-         return false;
-       }
- 
-       node.value.arguments[0] = b.stringLiteral(moduleName);
+       switch (node.value.arguments[0].type) {
+         case 'Literal': {
+           node.value.arguments[0] = b.literal(moduleName);
+ 
+           break;
+         }
+ 
+         case 'StringLiteral': {
+           node.value.arguments[0] = b.stringLiteral(moduleName);
+ 
+           break;
+         }
+       }

      return false;
    },
  });

  return recast.print(ast).code;
}
```

</details>


## Time to get real

Once you arrive at an implementation in AST Explorer, moving the code to the codemod is trivial. Copy-paste the object with the visit methods, then replace `b.` with `AST.builders.`. (How should we pass `moduleName`?)

<details>

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { AST } from '@codemod-utils/ast-javascript';
import { findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

type Data = {
  isTypeScript: boolean;
+   moduleName: string;
};

function renameModule(file: string, data: Data): string {
  const traverse = AST.traverse(data.isTypeScript);

  const ast = traverse(file, {
-     // ...
+     visitCallExpression(node) {
+       if (
+         node.value.callee.type !== 'Identifier' ||
+         node.value.callee.name !== 'module'
+       ) {
+         return false;
+       }
+ 
+       if (node.value.arguments.length !== 2) {
+         return false;
+       }
+ 
+       switch (node.value.arguments[0].type) {
+         case 'Literal': {
+           node.value.arguments[0] = AST.builders.literal(data.moduleName);
+ 
+           break;
+         }
+ 
+         case 'StringLiteral': {
+           node.value.arguments[0] = AST.builders.stringLiteral(data.moduleName);
+ 
+           break;
+         }
+       }
+ 
+       return false;
+     },
  });

  return AST.print(ast);
}

export function renameAcceptanceTests(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('tests/acceptance/**/*-test.{js,ts}', {
    projectRoot,
  });

  filePaths.forEach((filePath) => {
    const oldPath = join(projectRoot, filePath);
    const oldFile = readFileSync(oldPath, 'utf8');

    const data = {
      isTypeScript: filePath.endsWith('.ts'),
+       moduleName: 'New module',
    };

    const newFile = renameModule(oldFile, data);

    writeFileSync(oldPath, newFile, 'utf8');
  });
}
```

</details>

We expect the `test` script to fail, since all test modules in the `tests/acceptance` folder should be renamed to `New module`. Indeed, this is the case.

<details>

<summary>Expected output</summary>

The lines that start with `+` ("actual") help us understand what we might get, had we run the codemod on some project.

The lines that start with `-` ("expected") are what we should get, according to the _current_ output fixture project. Keep in mind that, until we finish writing the codemod, the expected lines may be incorrect.

```sh
❯ pnpm test

failures:

---- index > sample-project message ----
AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
+ actual - expected ... Lines skipped

{
  '.gitkeep': '',
...
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('New module', function (hooks) {\n" +
-         "module('Acceptance | forms', function (hooks) {\n" +
        '  setupApplicationTest(hooks);\n' +
        '\n' +
...
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('New module', function (hooks) {\n" +
-         "module('index', function (hooks) {\n" +
        '  setupApplicationTest(hooks);\n' +
        '\n' +
...
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('New module', function (hooks) {\n" +
-         "module('Acceptance | product-details', function (hooks) {\n" +
        '  setupApplicationTest(hooks);\n' +
        '  setupCustomAssertionsForProducts(hooks);\n' +
...
```

</details>

Currently, `data.moduleName` is hard-coded. We can derive the test module name from the file path. It's almost like the **inverse function** of what Ember CLI does. `@codemod-utils/files` provides `parseFilePath()` to help us parse the path.

<details>

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

The implementation for `renameModule()` remains unchanged and has been hidden for simplicity.

```diff
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { AST } from '@codemod-utils/ast-javascript';
- import { findFiles } from '@codemod-utils/files';
+ import { findFiles, parseFilePath } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

type Data = {
  isTypeScript: boolean;
  moduleName: string;
};

+ function getModuleName(filePath: string): string {
+   let { dir, name } = parseFilePath(filePath);
+ 
+   dir = dir.replace(/^tests\/acceptance(\/)?/, '');
+   name = name.replace(/-test$/, '');
+ 
+   const entityName = join(dir, name);
+ 
+   // a.k.a. friendlyTestDescription
+   return ['Acceptance', entityName].join(' | ');
+ }
+ 
function renameModule(file: string, data: Data): string {
  // ...
}

export function renameAcceptanceTests(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('tests/acceptance/**/*-test.{js,ts}', {
    projectRoot,
  });

  filePaths.forEach((filePath) => {
    const oldPath = join(projectRoot, filePath);
    const oldFile = readFileSync(oldPath, 'utf8');

    const data = {
      isTypeScript: filePath.endsWith('.ts'),
-       moduleName: 'New module',
+       moduleName: getModuleName(filePath),
    };

    const newFile = renameModule(oldFile, data);

    writeFileSync(oldPath, newFile, 'utf8');
  });
}
```

</details>

Run the `test` script again to check the test module names.

<details>

<summary>Expected output</summary>

Success! 🥳 The "actual" lines are what Ember CLI writes when we generate an acceptance test.

```sh
❯ pnpm test

failures:

---- index > sample-project message ----
AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
+ actual - expected ... Lines skipped

{
  '.gitkeep': '',
...
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('Acceptance | form', function (hooks) {\n" +
-         "module('Acceptance | forms', function (hooks) {\n" +
        '  setupApplicationTest(hooks);\n' +
        '\n' +
...
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('Acceptance | index', function (hooks) {\n" +
-         "module('index', function (hooks) {\n" +
        '  setupApplicationTest(hooks);\n' +
        '\n' +
...
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('Acceptance | products', function (hooks) {\n" +
-         "module('products page', function (hooks) {\n" +
        '  setupApplicationTest(hooks);\n' +
        '  setupCustomAssertionsForProducts(hooks);\n' +
...
```

</details>


### Fix fixtures

As mentioned in [Chapter 2](./02-understand-the-folder-structure.md#codemod-test-fixturessh), acceptance tests will likely fail when you create or update a step. Run the shell script to update the output fixture files and get the acceptance tests to pass.

```sh
./codemod-test-fixtures.sh
```

That was a big chapter with lots of new information. Before moving to the next one, consider taking the day off!


<div align="center">
  <div>
    Next: <a href="./06-step-2-update-integration-tests.md">Step 2: Update integration tests</a>
  </div>
  <div>
    Previous: <a href="./04-step-1-update-acceptance-tests-part-1.md">Step 1: Update acceptance tests (Part 1)</a>
  </div>
</div>
