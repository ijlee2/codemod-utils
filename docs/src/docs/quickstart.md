# Quickstart

## 1. Run CLI {#1-run-cli}

Change the directory to a place where you like to keep projects. Run [`@codemod-utils/cli`](./packages/codemod-utils-cli) to scaffold your codemod.

```sh {:no-line-numbers}
pnpx @codemod-utils/cli <your-codemod-name> [options]
```

This will create a folder named `your-codemod-name`.


### Add utilities {#1-run-cli-add-utilities}

By default, `@codemod-utils/cli` only installs the core packages: [`@codemod-utils/files`](./packages/codemod-utils-files) and [`@codemod-utils/tests`](./packages/codemod-utils-tests). Every codemod will need them.

If your codemod needs more, pass `--addon` and list the package name (without the prefix `@codemod-utils/`).

```sh {:no-line-numbers}
pnpx @codemod-utils/cli --addon blueprints package-json
```

Possible values for `--addon` are:

- [`ast-javascript`](./packages/codemod-utils-ast-javascript)
- [`ast-template`](./packages/codemod-utils-ast-template)
- [`ast-template-tag`](./packages/codemod-utils-ast-template-tag)
- [`blueprints`](./packages/codemod-utils-blueprints)
- [`ember`](./packages/codemod-utils-ember)
- [`package-json`](./packages/codemod-utils-package-json)


## 2. Make the initial commit {#2-make-the-initial-commit}

Change to the codemod directory, then run these scripts in sequence:

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


## 3. Start coding

> [!TIP]
> 
> As you write code, run `lint` and `test` to check your code.
>
> ```sh {:no-line-numbers}
> # Lint files
> pnpm lint
> pnpm lint:fix
>
> # Test files
> pnpm test
> ```
>
> Try running these scripts now. They should pass out of the box.

Not sure how to start? I recommend following the [main tutorial](./tutorials/main-tutorial/00-introduction) first. You can also check out existing codemods in [Made with codemod-utils](./#made-with-codemod-utils).
