# Introduction

[`<template>` tag](https://github.com/ember-template-imports/ember-template-imports) allows Ember developers to write a template (traditionally, an `*.hbs` file) and JavaScript code (`*.{js,ts}`) in the same file. The new format has the file extension of `.gjs` or `.gts`.

This creates interesting problems for codemods because they need to parse and update new file types. By definition, `ember-template-recast` (meant for `*.hbs` files) and `recast` (for `*.{js,ts}`) aren't enough.

[`@codemod-utils/ast-template-tag`](https://github.com/ijlee2/codemod-utils/blob/main/packages/ast/template-tag/README.md), which wraps [`content-tag`](https://github.com/embroider-build/content-tag), helps you _reuse_ methods that update `*.hbs` or `*.{js,ts}` files. To see how, we'll recreate a feature from [`ember-test-selectors`](https://github.com/mainmatter/ember-test-selectors): Remove all test selectors (attributes whose name starts with `data-test`) from templates.
