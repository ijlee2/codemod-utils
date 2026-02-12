# @codemod-utils/cli

_CLI to create a codemod project_


## Usage

Step 1. Run `@codemod-utils/cli` to scaffold your codemod.

```sh {:no-line-numbers}
pnpx @codemod-utils/cli <your-codemod-name> [options]
```

This will create a folder named `<your-codemod-name>`.

Step 2. Make the first commit. Change to the codemod directory, then run these scripts in sequence:

```sh {:no-line-numbers}
# Install dependencies
pnpm install
```

```sh {:no-line-numbers}
# Commit changes
git init
git add .
git commit -m "Initial commit"
```

```sh {:no-line-numbers}
# Push changes (to a new repo)
git remote add origin git@github.com:<your-github-handle>/<your-repo-name>.git
git branch -M main
git push -u origin main
```


## Options

### addon {#options-addon}

By default, `@codemod-utils/cli` only installs the core packages: [`@codemod-utils/files`](./codemod-utils-files) and [`@codemod-utils/tests`](./codemod-utils-tests). Every codemod will need them.

If your codemod needs more, pass `--addon` and list the package name (without the prefix `@codemod-utils/`).

```sh {:no-line-numbers}
pnpx @codemod-utils/cli --addon blueprints package-json
```

Possible values for `--addon` are:

- [`ast-javascript`](./codemod-utils-ast-javascript)
- [`ast-template`](./codemod-utils-ast-template)
- [`ast-template-tag`](./codemod-utils-ast-template-tag)
- [`blueprints`](./codemod-utils-blueprints)
- [`ember`](./codemod-utils-ember)
- [`package-json`](./codemod-utils-package-json)


### root {#options-root}

Pass `--root` to run the codemod somewhere else (i.e. not in the current directory).

```sh
pnpx @codemod-utils/cli --root <path/to/your/project>
```


### typescript {#options-typescript}

By default, `@codemod-utils/cli` creates a TypeScript project to help you maintain and extend the codemod.

To create a JavaScript project, set `--typescript` to `false`.

```sh
pnpx @codemod-utils/cli --typescript false
```
