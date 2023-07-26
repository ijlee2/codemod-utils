# Create the first step (Part 2)

By the end of [the last chapter](./04-create-the-first-step-part-1.md), we extracted a function called `renameModule()`. It received an input file (a file that may or may not be a valid acceptance test) and returned it unchanged.

```ts
function renameModule(file: string): string {
  return file;
}
```

In this chapter, we'll instruct this function to update the file (if it is valid) by renaming the test module. We'll use `@codemod-utils/ast-javascript` to parse and transform the file.

Goals:

- Use AST explorer as a playground
- Use `@codemod-utils/ast-javascript` to read and update JS/TS files
- Make early exits to simplify logic
- Auto-fix fixtures


## Hello, AST!

Libraries such as [`recast`](https://github.com/benjamn/recast) and [`ember-template-recast`](https://github.com/ember-template-lint/ember-template-recast) help us convert JS/TS and HBS files to an **AST (abstract syntax tree)**. `@codemod-utils` wraps these libraries to provide you an interface that is standardized:

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

Based on the how-to above, try updating `renameModule()`. It is to remain a no-op, but should now use `AST.traverse` and `AST.print`, in order to read the file and return it unchanged. How will you indicate whether a file is in JavaScript or TypeScript?

<details>

We pass a 2nd argument called `data`. It is an object that contains any additional information that we need to read and update the file.

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

Since the output of `renameModule()` hasn't changed, we can expect the `test` script to continue to pass.


## AST Explorer

Our next goal is to specify how to update the tree (how to rename the test module).

```ts
const ast = traverse(file, {
  // ...
});
````

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

A simplified file that covers the base and edge cases and ignores things that are unimportant.

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

When you check the console, you will see that `ast.program.body` (the input file) is an array with 2 elements (called **nodes**, in the context of a tree). The nodes correspond to the `import` statement on line 1 and the `module()` function on line 3.

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/0e028238-3f7b-4b53-911d-c2717345d682">

Since we are interested in updating `module()`, we expand the 2nd array element to find things that could help us. We see that there are 3 node `type`'s associated with `module()`:

- `ExpressionStatement`
- `CallExpression`
- `Identifier`

Now it's a game of Goldilocks: We have to pick one that provides just enough information so that we can update the test module name. This happens to be `CallExpression` so we will use the visit method named `visitCallExpression()`.

To understand how to call `visitCallExpression()`, use `console.log()` to determine its input and the error message in the console to determine its output.

<details>

<summary>Solution: Transform function</summary>

```diff
export default function transformer(code, { recast, parsers }) {
  const ast = recast.parse(code, { parser: parsers.typescript });
  const b = recast.types.builders;

  recast.visit(ast, {
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

From the console log, we see that `visitCallExpression()` visited only 1 node, even though the `test()` and `module()` functions, located inside the parent `module()`, are also of the type `CallExpression`. This, in our case, is a happy accident, but may be a bug in some other case. You can use `this.traverse()` to recursively visit all `CallExpression` nodes.

<details>

<summary>Solution: Transform function (a temporary change)</summary>

Don't forget to revert the change, since we don't need `this.traverse()`.

```diff
export default function transformer(code, { recast, parsers }) {
  const ast = recast.parse(code, { parser: parsers.typescript });
  const b = recast.types.builders;

  recast.visit(ast, {
    visitCallExpression(node) {
+      this.traverse(node);
+
      console.log('-- CallExpression --');
-       console.log(node.value);
+       console.log(node.value.callee.name);

      return false;
    },
  });

  return recast.print(ast).code;
}
```

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/d6be07b3-8537-493c-9e68-a0c600d85f38">

</details>


### Make early exits

Early exits are key to traversing a tree in a way that is maintainable and extensible. Without early exits, TypeScript will likely throw an error when you access a nested property of `node` (the error is, you made too many assumptions).

Recall the console logs from earlier:

<details>

<summary>Screenshots</summary>

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/0e028238-3f7b-4b53-911d-c2717345d682">

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/9a90afd3-59e3-4e6d-9cdf-e5f506ab1ab3">

</details>

Use the things (highlighted in orange, i.e. `node.value.callee` and `node.value.arguments`) to make early exits. If you made early exits correctly, the line `console.log(node.value);` will continue to log the node that corresponds to the parent `module()`.

<details>

<summary>Solution: Transform function</summary>

An extra check `node.value.arguments[0].type !== 'Literal'` is needed for JS files. Apparently, the `type` is `Literal` for JS and `StringLiteral` for TS? 😓

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

Thanks to early exits, a file that is not valid will remain unchanged.


### Build a new tree

Now that we've isolated the valid case, we can use the builders `b.stringLiteral()` to replace a part of the existing tree.

Again, try using the error message in the console to find out how to update the tree. (This is not easy!) In the output file at the bottom-right corner, you should see the test module name change.

<details>

<summary>Solution: Transform function</summary>

```diff
export default function transformer(code, { recast, parsers }) {
  const ast = recast.parse(code, { parser: parsers.typescript });
  const b = recast.types.builders;

+   const moduleName = 'New name';

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

```ts
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

      switch (node.value.arguments[0].type) {
        case 'Literal': {
          node.value.arguments[0] = b.literal(moduleName);

          break;
        }

        case 'StringLiteral': {
          node.value.arguments[0] = b.stringLiteral(moduleName);

          break;
        }
      }

      return false;
    },
  });

  return recast.print(ast).code;
}
```

</details>


## Time to get real

Once you arrive at an implementation in AST Explorer, moving the code to your project is trivial. Replace `b.` with `AST.builders.`, then cut-paste the visit methods object. (How should we pass `moduleName`?)

<details>

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

Disabling `@typescript-eslint/no-unsafe-member-access` is not really a part of the change (this seems to be required in `@typescript-eslint@v6`). Pretend that it's not there. 😓

```diff
+ /* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

We expect the `test` script to fail and the reason for failure to be, because the test module name has been changed to `New module` for all valid files in `tests/acceptance`. Indeed, this is the case.

<details>

<summary>Expected output</summary>

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
        "import { module, test } from 'qunit';\n" +
        '\n' +
+         "module('New module', function (hooks) {\n" +
-         "module('products page', function (hooks) {\n" +
        '  setupApplicationTest(hooks);\n' +
        '  setupCustomAssertionsForProducts(hooks);\n' +
...
          "import { module, test } from 'qunit';\n" +
          '\n' +
+           "module('New module', function (hooks) {\n" +
-           "module('Acceptance | products | product', function (hooks) {\n" +
          '  setupApplicationTest(hooks);\n' +
...
    }
  }
}
```

</details>

Currently, `data.moduleName` is hard-coded. We can derive the test module name from the file path—the "inverse function" of what Ember CLI does. `@codemod-utils/files` provides `parseFilePath()` to help us parse the path.

<details>

<summary>Solution: <code>src/steps/rename-acceptance-tests.ts</code></summary>

The implementation of `renameModule()` (it remains the same) has been hidden for simplicity.

```diff
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

Success! 🥳

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
          "import { module, test } from 'qunit';\n" +
          '\n' +
+           "module('Acceptance | products/product', function (hooks) {\n" +
-           "module('Acceptance | products | product', function (hooks) {\n" +
          '  setupApplicationTest(hooks);\n' +
...
    }
  }
}
```

</details>


### Fix fixtures

As mentioned in [Chapter 2](./02-understand-the-folder-structure.md#codemod-test-fixturessh), the acceptance tests will likely fail after you create or update a step. Luckily, there is a shell script that will automatically update fixture files and get the acceptance tests to pass.

```sh
./codemod-test-fixtures.sh
```

The `test` script should now pass.

(That was a long chapter with lots of new information. Before moving to the next one, consider taking the day off!)


<div align="center">
  <div>
    Next: TBA
  </div>
  <div>
    Previous: <a href="./04-create-the-first-step-part-1.md">Create the first step (Part 1)</a>
  </div>
</div>
