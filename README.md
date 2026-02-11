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

`codemod-utils` provides a set of **tools and conventions** to help you write codemods. Use [`@codemod-utils/cli`](/packages/cli/README.md) to get started.

```sh
pnpx @codemod-utils/cli <your-codemod-name>
```


### Package overview

- [`@codemod-utils/ast-javascript`](./packages/ast/javascript/README.md)
- [`@codemod-utils/ast-template`](./packages/ast/template/README.md)
- [`@codemod-utils/ast-template-tag`](./packages/ast/template-tag/README.md)
- [`@codemod-utils/blueprints`](./packages/blueprints/README.md)
- [`@codemod-utils/cli`](./packages/cli/README.md)
- [`@codemod-utils/ember`](./packages/ember/README.md)
- [`@codemod-utils/files`](./packages/files/README.md)
- [`@codemod-utils/package-json`](./packages/package-json/README.md)
- [`@codemod-utils/tests`](./packages/tests/README.md)


## Tutorials

- [Main tutorial](https://codemod-utils.netlify.app/docs/tutorials/main-tutorial/00-introduction)
- [Create blueprints](https://codemod-utils.netlify.app/docs/tutorials/create-blueprints/00-introduction)
- [Support Windows](https://codemod-utils.netlify.app/docs/tutorials/support-windows/00-introduction)
- [Update CSS files](https://codemod-utils.netlify.app/docs/tutorials/update-css-files/00-introduction)
- [Update `<template>` tags](https://codemod-utils.netlify.app/docs/tutorials/update-template-tags/00-introduction)


## Made with codemod-utils

1. [`@ember-intl/lint`](https://github.com/ember-intl/ember-intl/tree/main/packages/ember-intl-lint)
1. [`@ember-intl/vite`](https://github.com/ember-intl/ember-intl/tree/main/packages/ember-intl-vite)
1. [`analyze-ember-project-dependencies`](https://github.com/ijlee2/analyze-ember-project-dependencies)
1. [`blueprints-v2-addon`](https://github.com/ijlee2/create-v2-addon-repo/tree/main/packages/blueprints-v2-addon)
1. [`codemod-generate-release-notes`](https://github.com/Ajanth/codemod-generate-release-notes)
1. [`create-v2-addon-repo`](https://github.com/ijlee2/create-v2-addon-repo/tree/main/packages/create-v2-addon-repo)
1. [`ember-codemod-add-component-signatures`](https://github.com/ijlee2/ember-codemod-add-component-signatures)
1. [`ember-codemod-add-missing-tests`](https://github.com/ijlee2/ember-codemod-add-missing-tests)
1. [`ember-codemod-add-template-tags`](https://github.com/ijlee2/ember-codemod-add-template-tags)
1. [`ember-codemod-css-modules`](https://github.com/simplepractice/ember-codemod-css-modules)
1. [`ember-codemod-ember-render-helpers-to-v1`](https://github.com/buschtoens/ember-render-helpers/tree/main/packages/ember-codemod-ember-render-helpers-to-v1)
1. [`ember-codemod-pod-to-octane`](https://github.com/ijlee2/ember-codemod-pod-to-octane)
1. [`ember-codemod-remove-ember-css-modules`](https://github.com/ijlee2/embroider-css-modules/tree/main/packages/ember-codemod-remove-ember-css-modules)
1. [`ember-codemod-remove-global-styles`](https://github.com/ijlee2/embroider-css-modules/tree/main/packages/ember-codemod-remove-global-styles)
1. [`ember-codemod-remove-inject-as-service`](https://github.com/ijlee2/ember-codemod-remove-inject-as-service)
1. [`ember-codemod-rename-test-modules`](https://github.com/ijlee2/ember-codemod-rename-test-modules)
1. [`ember-codemod-sort-invocations`](https://github.com/ijlee2/ember-codemod-sort-invocations)
1. [`ember-codemod-v1-to-v2`](https://github.com/ijlee2/ember-codemod-v1-to-v2)
1. [`prettier-plugin-ember-hbs-tag`](https://github.com/ijlee2/prettier-plugin-ember-hbs-tag/)
1. [`type-css-modules`](https://github.com/ijlee2/embroider-css-modules/tree/main/packages/type-css-modules)
1. [`update-workspace-root-version`](https://github.com/ijlee2/update-workspace-root-version)


## Contributing

See the [Contributing](./CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](./LICENSE.md).
