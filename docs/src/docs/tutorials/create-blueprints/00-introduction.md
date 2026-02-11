# Introduction

This tutorial covers **blueprints**, files that you use like a "stamp" to create or update files. You will also learn how to **transform a user's CLI options** in the `create-options` step.

We will create a variant of [`create-v2-addon-repo`](https://github.com/ijlee2/create-v2-addon-repo/), a codemod that helps you generate as many [v2 addons](https://rfcs.emberjs.com/id/0507-embroider-v2-package-format/) as you want, along with a documentation and a test app.

To quickly illustrate how to use blueprints, ours will create just one file (`package.json`) in each addon and test app.
