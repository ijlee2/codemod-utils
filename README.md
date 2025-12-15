[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils

_Utilities for writing codemods_


## What is it?

`@codemod-utils` provides a set of **tools and conventions** to help you write codemods. Use [`@codemod-utils/cli`](/packages/cli/README.md) to get started.

```sh
npx @codemod-utils/cli <your-codemod-name>
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

- [Main tutorial](./tutorials/main-tutorial/00-introduction.md)
- [Create blueprints](./tutorials/create-blueprints/00-introduction.md)
- [Update CSS files](./tutorials/update-css-files/00-introduction.md)
- [Update `<template>` tags](./tutorials/update-template-tags/00-introduction.md)


## Codemods written with @codemod-utils

- [`@ember-intl/lint`](https://github.com/ember-intl/ember-intl/tree/main/packages/ember-intl-lint)
- [`analyze-ember-project-dependencies`](https://github.com/ijlee2/analyze-ember-project-dependencies)
- [`blueprints-v2-addon`](https://github.com/ijlee2/create-v2-addon-repo/tree/main/packages/blueprints-v2-addon)
- [`codemod-generate-release-notes`](https://github.com/Ajanth/codemod-generate-release-notes)
- [`create-v2-addon-repo`](https://github.com/ijlee2/create-v2-addon-repo/tree/main/packages/create-v2-addon-repo)
- [`ember-codemod-add-component-signatures`](https://github.com/ijlee2/ember-codemod-add-component-signatures)
- [`ember-codemod-add-missing-tests`](https://github.com/ijlee2/ember-codemod-add-missing-tests)
- [`ember-codemod-add-template-tags`](https://github.com/ijlee2/ember-codemod-add-template-tags)
- [`ember-codemod-css-modules`](https://github.com/simplepractice/ember-codemod-css-modules)
- [`ember-codemod-ember-render-helpers-to-v1`](https://github.com/buschtoens/ember-render-helpers/tree/main/packages/ember-codemod-ember-render-helpers-to-v1)
- [`ember-codemod-pod-to-octane`](https://github.com/ijlee2/ember-codemod-pod-to-octane)
- [`ember-codemod-remove-global-styles`](https://github.com/ijlee2/embroider-css-modules/tree/main/packages/ember-codemod-remove-global-styles)
- [`ember-codemod-remove-ember-css-modules`](https://github.com/ijlee2/embroider-css-modules/tree/main/packages/ember-codemod-remove-ember-css-modules)
- [`ember-codemod-remove-inject-as-service`](https://github.com/ijlee2/ember-codemod-remove-inject-as-service)
- [`ember-codemod-rename-test-modules`](https://github.com/ijlee2/ember-codemod-rename-test-modules)
- [`ember-codemod-sort-invocations`](https://github.com/ijlee2/ember-codemod-sort-invocations)
- [`ember-codemod-v1-to-v2`](https://github.com/ijlee2/ember-codemod-v1-to-v2)
- [`prettier-plugin-ember-hbs-tag`](https://github.com/ijlee2/prettier-plugin-ember-hbs-tag/)
- [`type-css-modules`](https://github.com/ijlee2/embroider-css-modules/tree/main/packages/type-css-modules)
- [`update-workspace-root-version`](https://github.com/ijlee2/update-workspace-root-version)


## Contributing

See the [Contributing](./CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](./LICENSE.md).
