[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ast-javascript

_Utilities for handling `*.{js,ts}` files as abstract syntax tree_


## What is it?

`@codemod-utils/ast-javascript` wraps the methods from [`recast`](https://github.com/benjamn/recast/), a library that helps you parse and transform `*.{js,ts}` files.

The wrappers help you read and write files of different types _in the same way_. This way, you can focus on learning the **builders** and **visit methods**, the building blocks for transforming code (library-dependent).

```js
import { AST } from '@codemod-utils/ast-javascript';

function transformCode(file, isTypeScript) {
  const traverse = AST.traverse(isTypeScript);

  const ast = traverse(file, {
    /* Use AST.builders to transform the tree */
  });

  return AST.print(ast);
}
```


## API

In the `traverse` call, you can specify how to visit the nodes of interest ("visit methods") and how to modify them ("builders").

- [Builders](https://github.com/benjamn/ast-types/blob/v0.16.1/src/gen/builders.ts#L3747-L4019)
- [Visit methods](https://github.com/benjamn/ast-types/blob/v0.16.1/src/gen/visitor.ts#L7-L307)


## How to test your code

Currently, `recast` lacks documentation and tutorials. This is unfortunate, given the large amount of builders and visit methods that it provides to help you transform code.

I recommend using [AST Explorer](https://astexplorer.net/) to test a small piece of code and familiarize with the API. The error messages from TypeScript, which you can find in your browser's console, can sometimes help. [AST Workshop](https://github.com/mainmatter/ast-workshop) provides a good starting point for Handlebars.

If you intend to publish your codemod, I recommend using [`@codemod-utils/tests`](../tests) (create and test file fixtures) to check the output and prevent regressions.


### AST Explorer for TypeScript

Select the following options to create a 4-tab window:

- Language: `JavaScript`
- Parser: `recast`
- Transform: `recast`

Copy-paste the visit methods from your file to AST explorer, then rename `AST.builders` to `b`.

<details>

<summary>Example</summary>

```js
/* Your file */
import { AST } from '@codemod-utils/ast-javascript';

export function transformCode(file) {
  const traverse = AST.traverse(true);

  const ast = traverse(file, {
    visitClassDeclaration(path) {
      const { body } = path.node.body;

      const nodesToAdd = [
        AST.builders.classProperty(
          AST.builders.identifier('styles'),
          AST.builders.identifier('styles'),
        ),
      ];

      body.unshift(...nodesToAdd);

      return false;
    },
  });

  return AST.print(ast);
}
```

```js
/* AST Explorer */
export default function transformer(code, { recast, parsers }) {
  const ast = recast.parse(code, { parser: parsers.typescript });
  const b = recast.types.builders;

  recast.visit(ast, {
    visitClassDeclaration(path) {
      const { body } = path.node.body;

      const nodesToAdd = [
        b.classProperty(
          b.identifier('styles'),
          b.identifier('styles')
        )
      ];

      body.unshift(...nodesToAdd);

      return false;
    }
  });

  return recast.print(ast).code;
}
```

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/74c6edd1-52b4-4ae4-ae61-0fd9407faf18">

</details>


## How to type your code

`@codemod-utils/ast-javascript` avoids re-exporting the types from `recast`. This is to prevent a change in their API from catastrophically affecting your code.

When you write a function that depends on their implementation, type what you don't own as `unknown`, then use `@ts-ignore` or `@ts-expect-error` as needed.

Most importantly, write tests to document the inputs and outputs of your codemod. When there is an API change, you can refactor code with ease and confidence.


## Compatibility

* Node.js v16 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
