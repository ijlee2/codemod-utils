[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/json

_Utilities for handling JSON_

## What is it?

`@codemod-utils/json` helps you update files like `package.json` and `tsconfig.json`.

## API

### convertToMap, convertToObject

`convertToMap()` converts an object to a Map, while `convertToObject()` converts the Map back to an object. Use these two utilities to update JSONs.

> [!NOTE] > `convertToObject()` creates an object with keys in alphabetical order.

<details>

<summary>Example</summary>

Remove dependencies (if they exist) from `package.json`.

```ts
const dependencies = convertToMap(packageJson["dependencies"]);

const packagesToDelete = [
  "@embroider/macros",
  "ember-auto-import",
  "ember-cli-babel",
  "ember-cli-htmlbars",
];

packagesToDelete.forEach((packageName) => {
  dependencies.delete(packageName);
});

packageJson["dependencies"] = convertToObject(dependencies);
```

</details>

<details>

<summary>Example</summary>

Configure `tsconfig.json` in an Ember app.

```ts
const compilerOptions = convertToMap(tsConfigJson["compilerOptions"]);

compilerOptions.set("paths", {
  [`${appName}/tests/*`]: ["tests/*"],
  [`${appName}/*`]: ["app/*"],
  "*": ["types/*"],
});

tsConfigJson["compilerOptions"] = convertToObject(compilerOptions);
```

</details>

### readPackageJson

Reads `package.json` and returns the parsed JSON.

> [!NOTE] > `readPackageJson()` checks that `package.json` exists and is a valid JSON.

<details>

<summary>Example</summary>

Check if the project, against which the codemod is run, has `typescript` as a dependency.

```ts
import { readPackageJson } from "@codemod-utils/json";

const { dependencies, devDependencies } = readPackageJson({
  projectRoot,
});

const projectDependencies = new Map([
  ...Object.entries(dependencies ?? {}),
  ...Object.entries(devDependencies ?? {}),
]);

const hasTypeScript = projectDependencies.has("typescript");
```

</details>

### validatePackageJson

Check if the fields `name` and `version` exist, in the sense that their values are a non-empty string.

When used with typescript, this will provide type-checking such that the usage of both variables no longer requires a non-null assertion operator `!` for statically-analyzable code after the function call.

<details>

<summary>Example</summary>

```js
import { readPackageJson, validatePackageJson } from "@codemod-utils/json";

const packageJson = readPackageJson({
  projectRoot,
});

validatePackageJson(packageJson);

const { name, version } = packageJson;
```

</details>

## Compatibility

- Node.js v18 or above

## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
