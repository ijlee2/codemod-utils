# Introduction

Thanks for trying out `@codemod-utils`!

In this tutorial, we will create a codemod called `ember-codemod-rename-tests` (to be precise, rename test modules).

```ts
/* Before: Module names are inconsistent (thanks to copy-paste) */
module('Integration | Component | ui/form', function (hooks) {});
module('Integration | Component | ui | form | field', function (hooks) {});
module('Integration | Component | <Ui::Page>', function (hooks) {});

/* After: Module names follow the conventions of Ember CLI */
module('Integration | Component | ui/form', function (hooks) {});
module('Integration | Component | ui/form/field', function (hooks) {});
module('Integration | Component | ui/page', function (hooks) {});
```

The codemod is practical (i.e. you can now type `ember test --filter ui/form` to run a group of related tests) and has the right scope—enough to cover the essentials (e.g. take small steps, read and write files, refactor code), but not too large to overwhelm you.


## Table of contents

1. [Create a project](./01-create-a-project.md)
1. ...
1. Maintain the project
