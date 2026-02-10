# Quickstart

## 1. Run CLI {#1-run-cli}

Change the directory to a place where you like to keep projects. Run [`@codemod-utils/cli`](https://github.com/ijlee2/codemod-utils/blob/main/packages/cli/README.md) to scaffold your codemod.

```sh {:no-line-numbers}
pnpx @codemod-utils/cli <your-codemod-name> [options]
```

This will create a folder named `your-codemod-name`.


### Add more utilities {#1-run-cli-add-more-utilities}

By default, `@codemod-utils/cli` only installs the core packages: [`@codemod-utils/files`](https://github.com/ijlee2/codemod-utils/blob/main/packages/files/README.md) and [`@codemod-utils/tests`](https://github.com/ijlee2/codemod-utils/blob/main/packages/tests/README.md). Every codemod will need them.

If you need more, pass `--addon` and list the package names.

```sh {:no-line-numbers}
pnpx @codemod-utils/cli --addon blueprints package-json
```

The options for `--addon` are:

- [`ast-javascript`](https://github.com/ijlee2/codemod-utils/tree/main/packages/ast/javascript/README.md)
- [`ast-template`](https://github.com/ijlee2/codemod-utils/tree/main/packages/ast/template/README.md)
- [`ast-template-tag`](https://github.com/ijlee2/codemod-utils/tree/main/packages/ast/template-tag/README.md)
- [`blueprints`](https://github.com/ijlee2/codemod-utils/tree/main/packages/blueprints/README.md)
- [`ember`](https://github.com/ijlee2/codemod-utils/tree/main/packages/ember/README.md)
- [`package-json`](https://github.com/ijlee2/codemod-utils/tree/main/packages/package-json/README.md)


### JavaScript only? {#1-run-cli-javascript-only}

By default, `@codemod-utils/cli` creates a TypeScript project to help you maintain and extend the codemod.

To create a JavaScript project, set `--typescript` to `false`.

```sh {:no-line-numbers}
pnpx @codemod-utils/cli --typescript false
```



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
> As you write code, you will want to lint and test files.
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

Not sure how to start? If this is your first time writing a codemod, we recommend going through the [main tutorial](https://github.com/ijlee2/codemod-utils/blob/main/tutorials/main-tutorial/00-introduction.md). See existing codemods in [Made with `@codemod-utils`](./#made-with-codemod-utils).
