# Create a project

Recall that `@codemod-utils/cli` automatically adds `@codemod-utils/files` and `@codemod-utils/tests`. We will instruct the CLI to also add [`@codemod-utils/blueprints`](../../packages/blueprints/README.md), so that we can use blueprints to create files.

Goals:

- Use `@codemod-utils/cli` to create a project
- Familiarize with the folder structure


## Use the CLI

Change the directory to a place where you like to keep projects. Then, run these commands:

```sh
# Create project
npx @codemod-utils/cli blueprint-for-v2-addon --addon blueprints

# Install dependencies
cd blueprint-for-v2-addon
pnpm install
```

> [!NOTE]
> Just like in [the main tutorial](../ember-codemod-rename-test-modules/04-step-1-update-acceptance-tests-part-1.md#remove-the-sample-step), remove the sample step, `add-end-of-line`.


## Folder structure

Let's take a look at how `blueprint-for-v2-addon` is structured as a tree. For simplicity, the tree only shows what's new, compared to that from [the main tutorial](ember-codemod-rename-test-modules/02-understand-the-folder-structure.md#folder-structure).

```sh
blueprint-for-v2-addon
└── src
    ├── blueprints
    │   └── .gitkeep
    └── utils
        └── blueprints.ts
```

We see that the CLI has scaffolded `src/blueprints` and `src/utils`.


### blueprints

The `blueprints` folder contains blueprint files, which we use to create files that our end-developers (users) will have.

> [!NOTE]
> `.gitkeep` is a placeholder file, one that our users don't need. Remove it.

For the most part, the folder structure and file names will match what end-developers will see in their project. At runtime, it is possible to change the file path (e.g. rename `__gitignore__` to `.gitignore`) or exclude the file (e.g. `tsconfig.json` for JavaScript projects).


### utils/blueprints.ts

The file exports a variable called `blueprintsRoot`. When end-developers install our codemod, our blueprint files are saved _somewhere_ on their machine. `blueprintsRoot` represents this runtime location.

In short, we can write and test our codemod as usual, without worrying about where the blueprint files will end up.


<div align="center">
  <div>
    Next: <a href="./02-create-static-files.md">Create static files</a>
  </div>
  <div>
    Previous: <a href="./00-introduction.md">Introduction</a>
  </div>
</div>
