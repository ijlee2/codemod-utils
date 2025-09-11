[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/package-json

_Utilities for handling `package.json`_


## What is it?

`@codemod-utils/package-json` helps you read and update `package.json`.


## API

### convertToMap, convertToObject

`convertToMap()` converts an object to a Map, while `convertToObject()` converts the Map back to an object. Use these two utilities to update objects in `package.json`.

> [!NOTE]
> `convertToObject()` creates an object with keys in alphabetical order.

<details>

<summary>Example</summary>

Remove dependencies (if they exist) from `package.json`.

```ts
const dependencies = convertToMap(packageJson['dependencies']);

const packagesToDelete = [
  '@embroider/macros',
  'ember-auto-import',
  'ember-cli-babel',
  'ember-cli-htmlbars',
];

packagesToDelete.forEach((packageName) => {
  dependencies.delete(packageName);
});

packageJson['dependencies'] = convertToObject(dependencies);
```

</details>


### readPackageJson

Reads `package.json` and returns the parsed JSON.

> [!NOTE]
> `readPackageJson()` checks that `package.json` exists and is a valid JSON.

<details>

<summary>Example</summary>

Check if a project has `typescript` as a dependency.

```ts
import { readPackageJson } from '@codemod-utils/package-json';

const { dependencies, devDependencies } = readPackageJson({
  projectRoot,
});

const projectDependencies = new Map([
  ...Object.entries(dependencies ?? {}),
  ...Object.entries(devDependencies ?? {}),
]);

const hasTypeScript = projectDependencies.has('typescript');
```

</details>


### validatePackageJson

(Type-)Checks that the fields `name` and `version` exist, in the sense that their values are a non-empty string.

<details>

<summary>Example</summary>

```js
import {
  readPackageJson,
  validatePackageJson,
} from '@codemod-utils/package-json';

const packageJson = readPackageJson({ projectRoot });

validatePackageJson(packageJson);

// Both guaranteed to be `string` (not `undefined`)
const { name, version } = packageJson;
```

</details>


## Compatibility

- Node.js v20 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
