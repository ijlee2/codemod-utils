[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/cli

_CLI to create a codemod project_


## Usage

Step 1. Use `npx` to run `@codemod-utils/cli`.

```sh
npx @codemod-utils/cli <your-codemod-name> [options]
```

This will create a folder named `<your-codemod-name>`.

Step 2. Change to the codemod directory, then run these scripts in sequence:

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


### Arguments

You must pass the name of your codemod.

```sh
npx @codemod-utils/cli ember-codemod-v1-to-v2
```


<details>

<summary>Optional: Add more utilities</summary>

By default, `@codemod-utils/cli` only installs [`@codemod-utils/files`](../files/README.md) and [`@codemod-utils/tests`](../tests/README.md). If you need more, pass `--addon` and list the package names.

```sh
npx @codemod-utils/cli --addon blueprints json
```

The options are:

- [`ast-javascript`](../ast/javascript/README.md)
- [`ast-template`](../ast/template/README.md)
- [`blueprints`](../blueprints/README.md)
- [`ember`](../ember/README.md)
- [`json`](../json/README.md)

</details>


<details>

<summary>Optional: Specify the project root</summary>

Pass `--root` to run the codemod somewhere else (i.e. not in the current directory).

```sh
npx @codemod-utils/cli --root <path/to/your/project>
```

</details>


<details>

<summary>Optional: Create a JavaScript project</summary>

By default, `@codemod-utils/cli` creates a TypeScript project to help you maintain and extend the codemod. To create a JavaScript project, set `--typescript` to `false`.

```sh
npx @codemod-utils/cli --typescript false
```

</details>


## Compatibility

- Node.js v20 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
