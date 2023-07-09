# <%= options.codemod.name %>

_Codemod to [PROVIDE A SHORT DESCRIPTION.]_


## Usage

### Arguments

[PROVIDE REQUIRED AND OPTIONAL ARGUMENTS.]

<details>
<summary>Optional: Specify the project root</summary>

Pass `--root` to run the codemod on a project somewhere else (i.e. not in the current directory).

```sh
npx <%= options.codemod.name %> --root=<path/to/your/project>
```

</details>


### Limitations

The codemod is designed to cover typical cases. It is not designed to cover one-off cases.

To better meet your needs, consider cloning the repo and running the codemod locally.

<% if (options.codemod.hasTypeScript) { %>```sh
cd <path/to/cloned/repo>

# Compile TypeScript
pnpm build

# Run codemod
./dist/bin/<%= options.codemod.name %>.js --root=<path/to/your/project>
```<% } else { %>```sh
cd <path/to/cloned/repo>

# Run codemod
./bin/<%= options.codemod.name %>.js --root=<path/to/your/project>
```<% } %>


## Compatibility

- Node.js v16 or above


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).