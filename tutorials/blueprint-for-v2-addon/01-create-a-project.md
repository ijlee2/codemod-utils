# Create a project

Recall that `@codemod-utils/cli` automatically adds `@codemod-utils/files` and `@codemod-utils/tests`. We will instruct the CLI to also add [`@codemod-utils/blueprints`](../../packages/blueprints/README.md), so that we can write blueprints to create files.

Goals:

- Use `@codemod-utils/cli` to create a project
- Familiarize with the folder structure


## Use the CLI

Change the directory to a place where you like to keep projects. Then, run these commands:

```sh
# Create project
npx @codemod-utils/cli --name blueprint-for-v2-addon --addon blueprints

# Install dependencies
cd blueprint-for-v2-addon
pnpm install
```


## Folder structure

Let's take a look at how `blueprint-for-v2-addon` is structured as a tree. For simplicity, the tree only shows what's important for the tutorial.

```sh
blueprint-for-v2-addon
└── src
    ├── blueprints
    ├── steps
    ├── types
    ├── utils
    │   └── blueprints.ts
    └── index.ts
```

We see that the CLI has scaffolded `src/blueprints` and `src/utils`.


### blueprints

The `blueprints` directory contains files that we want end-developers (our users) to have.

For the most part, the folder structure and file names will match what end-developers will see in their project. At runtime, it is possible to change the file path (e.g. rename `__gitignore__` to `.gitignore`) or exclude the file (e.g. `tsconfig.json` for JavaScript projects).


### utils/blueprints.ts

The file exports a variable called `blueprintsRoot`. When end-developers install our codemod, our blueprint files are saved _somewhere_ on their machine. `blueprintsRoot` represents this runtime location.

In short, we can write and test our codemod as usual, without worrying about where the blueprint files will end up.


<div align="center">
  <div>
    Next:
  </div>
  <div>
    Previous: <a href="./00-introduction.md">Introduction</a>
  </div>
</div>
