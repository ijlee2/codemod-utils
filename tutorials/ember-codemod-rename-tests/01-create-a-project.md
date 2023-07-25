# Create a project

We can use `@codemod-utils/cli` (a command-line interface) to create a Node project. It comes with lint, test, CI (continuous integration), and documentation out of the box.

By default, the CLI adds `@codemod-utils/files` and `@codemod-utils/tests` (these packages are "core"), because every codemod will need them. For `ember-codemod-rename-tests`, we need to parse and update JS and TS files, so we will instruct the CLI to add `@codemod-utils/ast-javascript` (an "addon").

Goals:

- Use `@codemod-utils/cli` to create a project


## Use the CLI

Change the directory to a place where you like to keep projects. Then, run these commands:

```sh
# Create project
npx @codemod-utils/cli --name ember-codemod-rename-tests --addon ast-javascript

# Install dependencies
cd ember-codemod-rename-tests
pnpm install
```

Afterwards, you may commit the changes to a GitHub repo.

```sh
# Commit changes
git init
git add .
git commit -m "Initial commit"
```

```sh
# Push changes (to a new repo)
git remote add origin git@github.com:<your-github-handle>/<your-repo-name>.git
git branch -M main
git push -u origin main
```


<div align="center">
  <div>
    Next: <a href="./02-understand-the-folder-structure.md">Understand the folder structure</a>
  </div>
  <div>
    Previous: <a href="./00-introduction.md">Introduction</a>
  </div>
</div>
