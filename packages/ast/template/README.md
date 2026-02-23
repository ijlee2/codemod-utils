[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ast-template

_Utilities for handling `*.hbs` files as abstract syntax tree_


## What is it?

`@codemod-utils/ast-template` provides methods from [`ember-template-recast`](https://github.com/ember-template-lint/ember-template-recast) to help you parse and transform `*.hbs` files.

```ts
import { AST } from '@codemod-utils/ast-template';

function transform(file: string): string {
  const traverse = AST.traverse();

  const ast = traverse(file, {
    /* Use AST.builders to transform the tree */
  });

  return AST.print(ast);
}
```


## Documentation

Visit https://codemod-utils.netlify.app/docs/packages/codemod-utils-ast-template.


## Compatibility

- Node.js v22 or above


## Contributing

See the [Contributing](../../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](./LICENSE.md).
