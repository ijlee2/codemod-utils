# Introduction

> [!IMPORTANT]
> Please complete the [main tutorial](../main-tutorial/00-introduction.md) first.

> [!NOTE]
> This tutorial shows how to use [`@codemod-utils/ast-template-tag`](../../packages/ast/template-tag#readme) to update `*.{gjs,gts}` files.

[`<template>` tag](https://github.com/ember-template-imports/ember-template-imports) allows Ember developers to write the template (traditionally, an `*.hbs` file) and the JavaScript (`*.{js,ts}`) in the same file. The new format has the file extension of `.gjs` or `.gts`.

This creates interesting problems for codemods because they need to parse and update new file types. By definition, `ember-template-recast` (meant for `*.hbs` files) and `recast` (for `*.{js,ts}`) aren't enough.

`@codemod-utils/ast-template-tag`, which wraps [`content-tag`](https://github.com/embroider-build/content-tag), helps you _reuse_ methods that update `*.hbs` and `*.{js,ts}` files. To see how, we'll recreate a feature in [`ember-test-selectors`](https://github.com/mainmatter/ember-test-selectors): Remove all test selectors (attributes whose name starts with `data-test`) from templates.


## Table of contents

1. [Create a project](./01-create-a-project.md)
1. [Tackle `*.hbs`](./02-tackle-hbs.md)
1. [Tackle `*.{gjs,gts}`](./03-tackle-gjs-gts.md)
1. [Conclusion](./04-conclusion.md)
