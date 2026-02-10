# Introduction

> [!IMPORTANT]
> Please complete the [main tutorial](../main-tutorial/00-introduction.md) first.

> [!NOTE]
> This tutorial shows how to use [`postcss`](https://github.com/postcss/postcss) and its plugins to update `*.css` files.

Currently, `@codemod-utils` doesn't provide a utility package to handle CSS. This is because (1) a few different libraries can be used, each with pros and cons, and (2) most codemods for Ember projects concern updating `*.{hbs,js,ts}` files (more recently, `*.{gjs,gts}`).

Nonetheless, you can write a codemod to update many CSS files. This tutorial will show how to integrate PostCSS with `@codemod-utils/files`. Our target project is assumed to be an Ember app with CSS modules.


## Table of contents

1. [Use existing plugins](./01-use-existing-plugins.md)
1. [Write custom plugins](./02-write-custom-plugins.md)
1. [Conclusion](./03-conclusion.md)
