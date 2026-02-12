[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ast-template-tag

_Utilities for handling `*.{gjs,gts}` files_


## What is it?

`@codemod-utils/ast-template-tag` uses [`content-tag`](https://github.com/embroider-build/content-tag) to help you parse and transform `*.{gjs,gts}` files.

```ts
import { updateJavaScript } from '@codemod-utils/ast-template-tag';

// Reuse a method that can update `*.{js,ts}` files
function transform(file: string): string {
  // ...
}

const newFile = updateJavaScript(oldFile, transform);
```

```ts
import { updateTemplates } from '@codemod-utils/ast-template-tag';

// Reuse a method that can update `*.hbs` files
function transform(file: string): string {
  // ...
}

const newFile = updateTemplates(oldFile, transform);
```


## Documentation

Visit https://codemod-utils.netlify.app/docs/packages/codemod-utils-ast-template-tag.


## Compatibility

- Node.js v20 or above


## Contributing

See the [Contributing](../../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](./LICENSE.md).
