# @codemod-utils/ast-template

_Utilities for handling `*.hbs` files as abstract syntax tree_


## What is it?

`@codemod-utils/ast-template` provides methods from [`ember-template-recast`](https://github.com/ember-template-lint/ember-template-recast) to help you parse and transform `*.hbs` files.

::: code-group

```ts [How to update templates]
import { AST } from '@codemod-utils/ast-template';

function transform(file: string): string {
  const traverse = AST.traverse();

  const ast = traverse(file, {
    /* Use AST.builders to transform the tree */
  });

  return AST.print(ast);
}
```

:::


## API

### AST {#api-ast}

An object that provides `builders`, `print`, and `traverse`.

In a `traverse` call, you can specify how to visit the nodes of interest ("visit methods") and how to modify them ("builders").

- [Builders](https://github.com/glimmerjs/glimmer-vm/blob/v0.95.0-%40glimmer/syntax/packages/%40glimmer/syntax/lib/v1/public-builders.ts#L490-L528)
- [Visit methods](https://github.com/glimmerjs/glimmer-vm/blob/v0.95.0-%40glimmer/syntax/packages/%40glimmer/syntax/lib/v1/visitor-keys.ts#L5-L30)


## How to test your code

Currently, `ember-template-recast` lacks documentation and tutorials. This is unfortunate, given the large amount of builders and visit methods that it provides to help you transform code.

I recommend using [AST Explorer](https://astexplorer.net/) to test a small piece of code and familiarize with the API. The error messages from TypeScript, which you can find in your browser's console, can sometimes help.

If you intend to publish your codemod, I recommend using [`@codemod-utils/tests`](./codemod-utils-tests) (create and test file fixtures) to check the output and prevent regressions.


### AST Explorer {#how-to-test-your-code-ast-explorer}

Select the following options to create a 4-tab window:

- Language: `Handlebars`
- Parser: `ember-template-recast`
- Transform: `ember-template-recast`

![](../../images/packages/ast-template-01.png)

Once you are satisfied with the code, you can copy-paste the visit method(s) to your file, then rename `b.` to `AST.builders.`.

::: code-group

```ts [Example (AST Explorer)]{5-17}
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

```ts [Example (Your file)]{7-19}
import { AST } from '@codemod-utils/ast-template';

function transform(file) {
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

:::


## How to type your code

`@codemod-utils/ast-template` avoids re-exporting the types from `ember-template-recast`. This is to prevent a change in their API from catastrophically affecting your code.

When you write a function that depends on their implementation, type what you don't own as `unknown`, then use `@ts-ignore` or `@ts-expect-error` as needed.

Most importantly, write tests to document the inputs and outputs of your codemod. When there is an API change, you can refactor code with ease and confidence.
