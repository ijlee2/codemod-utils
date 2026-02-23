[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ast-javascript

_Utilities for handling `*.{js,ts}` files as abstract syntax tree_


## What is it?

`@codemod-utils/ast-javascript` provides methods from [`recast`](https://github.com/benjamn/recast/) to help you parse and transform `*.{js,ts}` files.

```ts
import { AST } from '@codemod-utils/ast-javascript';

type Data = {
  isTypeScript: boolean;
};

function transform(file: string, data: Data): string {
  const traverse = AST.traverse(data.isTypeScript);

  const ast = traverse(file, {
    /* Use AST.builders to transform the tree */
  });

  return AST.print(ast);
}
```


## Documentation

Visit https://codemod-utils.netlify.app/docs/packages/codemod-utils-ast-javascript.


## Compatibility

- Node.js v22 or above


## Contributing

See the [Contributing](../../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](./LICENSE.md).
