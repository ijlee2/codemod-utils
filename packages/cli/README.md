[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/cli

_CLI to create a codemod project_


## Usage

Step 1. Use `pnpx` to run `@codemod-utils/cli`.

```sh
pnpx @codemod-utils/cli <your-codemod-name> [options]
```

This will create a folder named `<your-codemod-name>`.

Step 2. Make the first commit. Change to the codemod directory, then run these scripts in sequence:

```sh
# Install dependencies
pnpm install
```

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


## Options

### addon

By default, `@codemod-utils/cli` only installs the core packages: [`@codemod-utils/files`](../files/README.md) and [`@codemod-utils/tests`](../tests/README.md). Every codemod will need them.

If your codemod needs more, pass `--addon` and list the package name (without the prefix `@codemod-utils/`).

```sh
pnpx @codemod-utils/cli --addon blueprints package-json
```

Possible values for `--addon` are:

- [`ast-javascript`](../ast/javascript/README.md)
- [`ast-template`](../ast/template/README.md)
- [`ast-template-tag`](../ast/template-tag/README.md)
- [`blueprints`](../blueprints/README.md)
- [`ember`](../ember/README.md)
- [`package-json`](../package-json/README.md)


### root

Pass `--root` to run the codemod somewhere else (i.e. not in the current directory).

```sh
pnpx @codemod-utils/cli --root <path/to/your/project>
```


### typescript

By default, `@codemod-utils/cli` creates a TypeScript project to help you maintain and extend the codemod.

To create a JavaScript project, set `--typescript` to `false`.

```sh
pnpx @codemod-utils/cli --typescript false
```


## Compatibility

- Node.js v20 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](./LICENSE.md).
