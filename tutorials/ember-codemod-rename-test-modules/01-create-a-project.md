# Create a project

We can use `@codemod-utils/cli` (a command-line interface) to create a Node project. It comes with lint, test, CI (continuous integration), and documentation out of the box.

By default, the CLI adds `@codemod-utils/files` and `@codemod-utils/tests` (these packages are "core"), because every codemod will need them. For `ember-codemod-rename-test-modules`, we need to parse and update JS and TS files, so we will instruct the CLI to add `@codemod-utils/ast-javascript` (an "addon").

Goals:

- Use `@codemod-utils/cli` to create a project
- Familiarize with `lint`, `lint:fix`, and `test`


## Use the CLI

Change the directory to a place where you like to keep projects. Then, run these commands:

```sh
# Create project
npx @codemod-utils/cli --name ember-codemod-rename-test-modules --addon ast-javascript

# Install dependencies
cd ember-codemod-rename-test-modules
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


## Local development

As you write code, you will want to lint and test files.

```sh
# Lint files
pnpm lint
pnpm lint:fix

# Test files
pnpm test
```

Try running these scripts now. They should pass out of the box. (The scripts for local development are documented in `CONTRIBUTING.md`.)


## Update configurations

The CLI added a few placeholders. At some point (before the initial commit or, at the latest, before publishing the codemod), you will want to manually update these files:

- `LICENSE.md` - copyright information
- `package.json` - `author`, `description`, `repository` (remove `private` to publish the codemod)
- `README.md` - link to the CI status badge, description, codemod arguments


<div align="center">
  <div>
    Next: <a href="./02-understand-the-folder-structure.md">Understand the folder structure</a>
  </div>
  <div>
    Previous: <a href="./00-introduction.md">Introduction</a>
  </div>
</div>
