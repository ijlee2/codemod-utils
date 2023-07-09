[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/cli

_CLI to create a codemod_


## Usage

Use `npx` to run `@codemod-utils/cli` and provide the codemod's name. (Alternatively, you can globally install `@codemod-utils/cli`.)

```sh
npx @codemod-utils/cli --name <your-codemod-name> <additional arguments>
```

This will create a folder named `<your-codemod-name>`. Change to this directory, then run the following scripts:

```sh
# Install dependencies
pnpm install

# Push to a (new) GitHub repository
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<your-github-handle>/<your-repo-name>.git
git push -u origin main
```

Before pushing to the repository, consider updating `README.md` (e.g. link to the CI status badge).


### Arguments

You must pass `--name` to name your codemod.

```sh
npx @codemod-utils/cli --name ember-codemod-v1-to-v2
```


<details>
<summary>Optional: Add <code>@codemod-utils</code> packages</summary>

By default, `@codemod-utils/cli` only installs [`@codemod-utils/files`](../files/README.md) and [`@codemod-utils/tests`](../tests/README.md). To add more utilities, pass `--addon` and the list of package names.

```sh
npx @codemod-utils/cli --addon blueprints json
```

The available package names are:

- [`ast-javascript`](../ast/javascript/README.md)
- [`ast-template`](../ast/template/README.md)
- [`blueprints`](../blueprints/README.md)
- [`ember-cli-string`](../ember-cli-string/README.md)
- [`json`](../json/README.md)

</details>


<details>
<summary>Optional: Specify the project root</summary>

Pass `--root` to run the codemod somewhere else (i.e. not in the current directory).

```sh
npx @codemod-utils/cli --root=<path/to/your/project>
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

- Node.js v16 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
