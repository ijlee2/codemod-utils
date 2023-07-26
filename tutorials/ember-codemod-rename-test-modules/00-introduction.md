# Introduction

We will create a codemod called `ember-codemod-rename-test-modules`. It helps **end-developers** (our users) standardize the names of their test modules in an Ember app, addon, or engine.

```ts
/* Before: Module names are inconsistent (thanks to copy-paste) */
module('Integration | Component | ui/form', function (hooks) {});
module('Integration | Component | ui | form | field', function (hooks) {});
module('Integration | Component | <Ui::Page>', function (hooks) {});
```

```ts
/* After: Module names follow the conventions of Ember CLI */
module('Integration | Component | ui/form', function (hooks) {});
module('Integration | Component | ui/form/field', function (hooks) {});
module('Integration | Component | ui/page', function (hooks) {});
```

The codemod is practical (i.e. end-developers can now use `--filter` to run a group of related tests) and has the right scope—enough to cover the essentials (e.g. take small steps, read and write files, refactor code), but not too large to overwhelm you.


## Table of contents

1. [Create a project](./01-create-a-project.md)
1. [Understand the folder structure](./02-understand-the-folder-structure.md)
1. [Sketch out the solution](./03-sketch-out-the-solution.md)
1. [Create the first step (Part 1)](./04-create-the-first-step-part-1.md)
1. ...
1. Maintain the project
