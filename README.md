[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils

_Utilities for writing codemods_


## What is it?

`@codemod-utils` provides a set of **tools and conventions** to help you write codemods. Use [`@codemod-utils/cli`](/packages/cli/README.md) to get started.

```sh
npx @codemod-utils/cli --name <your-codemod-name>
```


### Package overview

- [`@codemod-utils/ast-javascript`](./packages/ast/javascript/README.md)
- [`@codemod-utils/ast-template`](./packages/ast/template/README.md)
- [`@codemod-utils/blueprints`](./packages/blueprints/README.md)
- [`@codemod-utils/cli`](./packages/cli/README.md)
- [`@codemod-utils/ember-cli-string`](./packages/ember-cli-string/README.md)
- [`@codemod-utils/files`](./packages/files/README.md)
- [`@codemod-utils/json`](./packages/json/README.md)
- [`@codemod-utils/tests`](./packages/tests/README.md)


## Tutorials

- [Main tutorial](./tutorials/ember-codemod-rename-test-modules/00-introduction.md)
- [Blueprints](./tutorials/blueprint-for-v2-addon/00-introduction.md)
- [`<template>`-tag components](./tutorials/template-tag-components/00-introduction.md)


## Codemods written with @codemod-utils

- `blueprint-for-v2-addon` (internal)
- [`ember-codemod-args-to-signature`](https://github.com/ijlee2/ember-codemod-args-to-signature)
- [`ember-codemod-css-modules`](https://github.com/simplepractice/ember-codemod-css-modules)
- [`ember-codemod-pod-to-octane`](https://github.com/ijlee2/ember-codemod-pod-to-octane)
- [`ember-codemod-remove-ember-css-modules`](https://github.com/ijlee2/embroider-css-modules/tree/main/packages/ember-codemod-remove-ember-css-modules)
- [`ember-codemod-rename-test-modules`](https://github.com/ijlee2/ember-codemod-rename-test-modules)
- [`ember-codemod-template-tag`](https://github.com/IgnaceMaes/ember-codemod-template-tag)
- [`ember-codemod-v1-to-v2`](https://github.com/ijlee2/ember-codemod-v1-to-v2)
- [`type-css-modules`](https://github.com/ijlee2/embroider-css-modules/tree/main/packages/type-css-modules)


## License

This project is licensed under the [MIT License](LICENSE.md).
