# Introduction

> [!IMPORTANT]
> Please complete the [main tutorial](../ember-codemod-rename-test-modules/00-introduction.md) first.

> [!NOTE]
> This tutorial shows how to use [`content-tag`](https://github.com/embroider-build/content-tag#readme) and [`@codemod-utils/ast-template`](../../packages/ast/template#readme) (i.e. `ember-template-recast`) to read and update `*.{gjs,gts}` files.
>
> `content-tag`, in comparison to `ember-template-recast`, is still in development. Its API may change so `@codemod-utils` doesn't provide a utility package yet.

[`<template>` tag](https://github.com/ember-template-imports/ember-template-imports) allows Ember developers to write the template (traditionally, an `*.hbs` file) and the class (`*.{js,ts}`) in the same file. The new format has the file extension `.gjs` or `.gts`.

This creates interesting problems for codemods, because they need to parse and update new file types. By definition, `ember-template-recast` (meant for `*.hbs` files) and `recast` (for `*.{js,ts}`) aren't enough.

`content-tag` helps Node programs understand `*.{gjs,gts}` files. It does so by returning the locations of all `<template>` tags in a file and the template code (the "contents") for each tag. At the time of writing, `content-tag` doesn't provide a way to easily update the file.

Nonetheless, we can already solve 1 specific case: Use `@codemod-utils/ast-template` to update the template.


## Table of contents

1. [A simple example](./01-a-simple-example.md)
1. [Create utilities](./02-create-utilities.md)
1. [Conclusion](./03-conclusion.md)
