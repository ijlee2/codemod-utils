# Introduction

`codemod-utils` doesn't provide a utility package to handle CSS. This is because (1) a few different libraries can be used, each with pros and cons, and (2) most codemods for Ember projects concern updating `*.{hbs,js,ts}` files (more recently, `*.{gjs,gts}`).

Nonetheless, you can write a codemod to update `*.css` files. This tutorial will show how to integrate [PostCSS](https://postcss.org/). Our target project is assumed to be an Ember app with CSS modules.
