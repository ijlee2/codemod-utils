[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils

_Utilities for writing codemods_


## What are codemods?

A codemod is a function that takes files as input and output. It reads the files of interest, makes some changes, then saves the result to your disk.

<div align="left">
  <img alt="" src="./docs/src/images/index/codemod.jpg" width="600" />
</div>

One special case is the identity function. That is, not all codemods need to make a change. As a result, linters are a codemod. Tools that gather files, collect metrics, analyze package dependencies, or find vulnerabilities are also one.

In short, codemods are everywhere and you’ve likely used a few already.


## What is codemod-utils?

`codemod-utils` provides a set of **tools and conventions** to help you write codemods. Use [`@codemod-utils/cli`](./packages/cli/README.md) to get started.

```sh
pnpx @codemod-utils/cli <your-codemod-name>
```


## Package overview

- [`@codemod-utils/ast-javascript`](./packages/ast/javascript/README.md)
- [`@codemod-utils/ast-template`](./packages/ast/template/README.md)
- [`@codemod-utils/ast-template-tag`](./packages/ast/template-tag/README.md)
- [`@codemod-utils/blueprints`](./packages/blueprints/README.md)
- [`@codemod-utils/cli`](./packages/cli/README.md)
- [`@codemod-utils/ember`](./packages/ember/README.md)
- [`@codemod-utils/files`](./packages/files/README.md)
- [`@codemod-utils/package-json`](./packages/package-json/README.md)
- [`@codemod-utils/tests`](./packages/tests/README.md)


## Documentation

Visit https://codemod-utils.netlify.app/.


## Contributing

See the [Contributing](./CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](./LICENSE.md).
