# Create a project

`@codemod-utils/cli` always adds `@codemod-utils/files` and `@codemod-utils/tests`. We will instruct the CLI to also include [`@codemod-utils/blueprints`](https://github.com/ijlee2/codemod-utils/tree/main/packages/blueprints/README.md) so that we can create files using blueprints.

Goals:

- Use `@codemod-utils/cli` to create a project
- Familiarize with the folder structure


## Use the CLI

Change the directory to a place where you like to keep projects. Then, run these commands:

```sh {:no-line-numbers}
# Create project
pnpx @codemod-utils/cli create-v2-addon-repo --addon blueprints

# Install dependencies
cd create-v2-addon-repo
pnpm install
```


## Folder structure

Let's take a look at how `create-v2-addon-repo` is structured as a tree. For simplicity, the tree only shows what's new, compared to what we saw in [the main tutorial](../main-tutorial/02-understand-the-folder-structure#folder-structure).

```sh {:no-line-numbers}
create-v2-addon-repo
└── src
    ├── blueprints
    │   └── .gitkeep
    └── utils
        └── blueprints.ts
```

We see that the CLI has scaffolded files in `/src/blueprints` and `/src/utils`.


### src/blueprints {#folder-structure-src-blueprints}

The `src/blueprints` folder stores blueprint files that we will use to create files.

> [!IMPORTANT]
>
> `.gitkeep` is a placeholder file, one that our users don't need. Remove it.

The file paths (i.e. the folder structure, file name, and file extension) in `/src/blueprints` should match what end-developers will see in their project. This will help you understand how your blueprints work and fix issues quickly.

You can also write the codemod so that, at runtime, it will change file paths (e.g. rename `__gitignore__` to `.gitignore`) or exclude files under certain circumstances (e.g. don't create `tsconfig.json` for JavaScript projects).


### src/utils/blueprints.ts {#folder-structure-src-utils-blueprints-ts}

This file provides a variable called `blueprintsRoot`. When end-developers install our codemod, our blueprint files get saved somewhere on their machine. `blueprintsRoot` represents this runtime location.

::: code-group

```ts [src/utils/blueprints.ts]
export * from './blueprints/blueprints-root.js';
```

```ts [src/utils/blueprints/blueprints-root.ts]{7}
import { join } from 'node:path';

import { getFilePath } from '@codemod-utils/blueprints';

const fileURL = import.meta.url;

export const blueprintsRoot = join(getFilePath(fileURL), '../../blueprints');
```

:::

In short, `blueprintsRoot` helps us write and test our codemod as usual. We don't need to think about where the blueprints will end up.
