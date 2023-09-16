[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ast-template

_Utilities for handling `*.hbs` files as abstract syntax tree_


## What is it?

`@codemod-utils/ast-template` wraps the methods from [`ember-template-recast`](https://github.com/ember-template-lint/ember-template-recast), a library that helps you parse and transform `*.hbs` files.

The wrappers help you read and write files of different types _in the same way_. This way, you can focus on learning the **builders** and **visit methods**, the building blocks for transforming code (library-dependent).

```js
import { AST } from '@codemod-utils/ast-template';

function transformCode(file) {
  const traverse = AST.traverse();

  const ast = traverse(file, {
    /* Use AST.builders to transform the tree */
  });

  return AST.print(ast);
}
```


## API

In the `traverse` call, you can specify how to visit the nodes of interest ("visit methods") and how to modify them ("builders").

- [Builders](https://github.com/glimmerjs/glimmer-vm/blob/v0.84.3/packages/%40glimmer/syntax/lib/v1/public-builders.ts#L530-L570)
- [Visit methods](https://github.com/glimmerjs/glimmer-vm/blob/v0.84.3/packages/%40glimmer/syntax/lib/v1/visitor-keys.ts#L8-L39)


## How to test your code

Currently, `ember-template-recast` lacks documentation and tutorials. This is unfortunate, given the large amount of builders and visit methods that it provides to help you transform code.

I recommend using [AST Explorer](https://astexplorer.net/) to test a small piece of code and familiarize with the API. The error messages from TypeScript, which you can find in your browser's console, can sometimes help. [AST Workshop](https://github.com/mainmatter/ast-workshop) provides a good starting point for Handlebars.

If you intend to publish your codemod, I recommend using [`@codemod-utils/tests`](../tests) (create and test file fixtures) to check the output and prevent regressions.


### AST Explorer for Handlebars

Select the following options to create a 4-tab window:

- Language: `Handlebars`
- Parser: `ember-template-recast`
- Transform: `ember-template-recast`

Copy-paste the visit methods from your file to AST explorer, then rename `AST.builders` to `b`.

<details>

<summary>Example</summary>

```js
/* Your file */
import { AST } from '@codemod-utils/ast-template';

function transformCode(file) {
  const traverse = AST.traverse();

  const ast = traverse(file, {
    AttrNode(node) {
      if (node.name !== 'local-class') {
        return;
      }

      node.name = 'class';

      const attributeValue = node.value.chars.trim();

      node.value = AST.builders.mustache(
        AST.builders.path(`this.styles.${attributeValue}`),
      );
    },
  });

  return AST.print(ast);
}
```

```js
/* AST Explorer */
module.exports = function(env) {
  const b = env.syntax.builders;

  return {
    AttrNode(node) {
      if (node.name !== 'local-class') {
        return;
      }

      node.name = 'class';

      const attributeValue = node.value.chars.trim();

      node.value = b.mustache(
        b.path(`this.styles.${attributeValue}`),
      );
    },
  };
};
```

<img width="1440" alt="" src="https://github.com/ijlee2/codemod-utils/assets/16869656/149deed5-153e-42c9-ace1-cd531d85c59d">

</details>


## How to type your code

`@codemod-utils/ast-template` avoids re-exporting the types from `ember-template-recast`. This is to prevent a change in their API from catastrophically affecting your code.

When you write a function that depends on their implementation, type what you don't own as `unknown`, then use `@ts-ignore` or `@ts-expect-error` as needed.

Most importantly, write tests to document the inputs and outputs of your codemod. When there is an API change, you can refactor code with ease and confidence.


## Compatibility

- Node.js v18 or above


## Contributing

See the [Contributing](../../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
