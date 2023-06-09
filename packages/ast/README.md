[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ast

_Utilities for handling abstract syntax tree_


## What is it?

`@codemod-utils/ast` wraps the methods from [`ember-template-recast`](https://github.com/ember-template-lint/ember-template-recast) and [`recast`](https://github.com/benjamn/recast/), libraries that help you parse and transform `*.hbs` and `*.{js,ts}` files.

The wrappers help you read and write files of different types _in the same way_. This way, you can focus on learning the **builders** and **visit methods**, the building blocks for transforming code (library-dependent).

<details>

<summary>Outline for transforming <code>*.hbs</code> files</summary>

```js
import { ASTHandlebars as AST } from '@codemod-utils/ast';

function transformCode(file) {
  const traverse = AST.traverse();

  const ast = traverse(file, {
    /* Use AST.builders to transform the tree */
  });

  return AST.print(ast);
}
```

</details>

<details>

<summary>Outline for transforming <code>*.{js,ts}</code> files</summary>

```js
import { ASTJavaScript as AST } from '@codemod-utils/ast';

function transformCode(file, isTypeScript) {
  const traverse = AST.traverse(isTypeScript);

  const ast = traverse(file, {
    /* Use AST.builders to transform the tree */
  });

  return AST.print(ast);
}
```

</details>


## API

### ASTHandlebars

- [Builders](https://github.com/glimmerjs/glimmer-vm/blob/v0.84.3/packages/%40glimmer/syntax/lib/v1/public-builders.ts#L530-L570)
- [Visit methods](https://github.com/glimmerjs/glimmer-vm/blob/v0.84.3/packages/%40glimmer/syntax/lib/v1/visitor-keys.ts#L8-L39)


### ASTJavaScript

- [Builders](https://github.com/benjamn/ast-types/blob/v0.16.1/src/gen/builders.ts#L3747-L4019)
- [Visit methods](https://github.com/benjamn/ast-types/blob/v0.16.1/src/gen/visitor.ts#L7-L307)


## How to test your code

Currently, `ember-template-recast` and `recast` lack documentation and tutorials. This is unfortunate, given the large amount of builders and visit methods that they provide to help you transform code.

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
import { ASTHandlebars as AST } from '@codemod-utils/ast';

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
import { ASTJavaScript as AST } from '@codemod-utils/ast';

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


## Compatibility

* Node.js v16 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
