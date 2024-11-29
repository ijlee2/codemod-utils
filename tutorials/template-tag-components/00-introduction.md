# Introduction

> [!IMPORTANT]
> Please complete the [main tutorial](../ember-codemod-rename-test-modules/00-introduction.md) first.

> [!NOTE]
> This tutorial shows how to use [`content-tag`](https://github.com/embroider-build/content-tag#readme) and [`@codemod-utils/ast-template`](../../packages/ast/template#readme) (i.e. `ember-template-recast`) to read and update `*.{gjs,gts}` files.
>
> `content-tag`, in comparison to `ember-template-recast`, is not stable. Since its API may change, `@codemod-utils` doesn't provide a utility package yet.

[`<template>` tag components](https://github.com/ember-template-imports/ember-template-imports) allow Ember developers to write JavaScript or TypeScript in the same file as the template. The new format has the file extension `.gjs` or `.gts`.

This creates interesting problems for codemods, since they need to parse and transform a new file type. By definition, `ember-template-recast` (meant for `*.hbs` files) and `recast` (for `*.{js,ts}`) aren't enough.

`content-tag` helps Node programs understand `*.{gjs,gts}` files. It does so by returning the locations of all `<template>` tags in a file and the template code (the "contents") for each tag. At the time of writing, it doesn't provide a way to update the file.

Luckily, we can use `@codemod-utils/ast-template` to update template code.


## Table of contents

1. [A simple example](./01-a-simple-example.md)
1. [Create utilities](./02-create-utilities.md)
1. [Conclusion](./03-conclusion.md)
