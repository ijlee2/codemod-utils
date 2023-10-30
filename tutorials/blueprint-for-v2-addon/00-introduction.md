# Introduction

> [!IMPORTANT]
> Please complete the [main tutorial](../ember-codemod-rename-test-modules/00-introduction.md) first.

> [!NOTE]
> This tutorial covers **blueprints**, files that you can use like a "stamp" to create or update certain files in a project. You will also learn how to transform a user's CLI options in the `create-options` step.

We will partially recreate `blueprint-for-v2-addon`, a codemod that helps [CLARK](https://www.clark.io/) write [v2 addons](https://rfcs.emberjs.com/id/0507-embroider-v2-package-format/). It creates an addon and a test app similarly to [`@embroider/addon-blueprint`](https://github.com/embroider-build/addon-blueprint), with some exceptions:

- We can customize files, lint configurations, and dependencies, and standardize these deviations.
- Upstream errors (from `ember-cli` and `@embroider/addon-blueprint`) have a little effect. 
- Generating files is simpler and faster.

```sh
# Average for @embroider/addon-blueprint
❯ time EMBER_CLI_PNPM=true ember addon "@my-ui/button" --addon-location "ui/button" --blueprint "@embroider/addon-blueprint" --pnpm --skip-npm --typescript

1.87s user 1.18s system 126% cpu 2.409 total
```

```sh
# Average for blueprint-for-v2-addon
❯ time pnpm generate-addon --addon-name "@my-ui/button" --addon-location "ui/button"

1.86s user 0.23s system 133% cpu 1.565 total
```


## Table of contents

1. [Create a project](./01-create-a-project.md)
1. [Create static files](./02-create-static-files.md)
1. [Define options](./03-define-options.md)
1. [Create dynamic files](./04-create-dynamic-files.md)
1. [Conclusion](./05-conclusion.md)
