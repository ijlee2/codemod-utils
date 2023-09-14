[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/json

_Utilities for handling JSON_


## What is it?

`@codemod-utils/json` helps you update files like `package.json` and `tsconfig.json`.


## API

### convertToMap

Converts an object to a [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map). The `Map` data structure helps you add, update, and remove entries.

<details>

<summary>Example</summary>

```js
import { convertToMap } from '@codemod-utils/json';

function updateDependencies(packageJson) {
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
}
```

</details>


### convertToObject

Converts a Map (back) to an object. `convertToObject` helps you update the JSON.

<details>

<summary>Example</summary>

```js
import { convertToMap, convertToObject } from '@codemod-utils/json';

function updateDependencies(packageJson) {
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
}
```

</details>


### readPackageJson, validatePackageJson

Reads `package.json` and returns the parsed JSON.

<details>

<summary>Example</summary>

```js
import { readPackageJson } from '@codemod-utils/json';

const { dependencies, devDependencies } = readPackageJson({
  projectRoot: '__projectRoot__',
});

const projectDependencies = new Map([
  ...Object.entries(dependencies ?? {}),
  ...Object.entries(devDependencies ?? {}),
]);

const hasTypeScript = projectDependencies.has('typescript');
```

</details>

`readPackageJson` checks that `package.json` exists and is a valid JSON. Call `validatePackageJson` if you need to know that the `name` and `version` fields exist.

<details>

<summary>Example</summary>

```js
import { readPackageJson, validatePackageJson } from '@codemod-utils/json';

const packageJson = readPackageJson({
  projectRoot: '__projectRoot__',
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
