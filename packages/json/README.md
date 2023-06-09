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


### readPackageJson

Reads `package.json` in the user's project. If the file is valid, `readPackageJson` returns the parsed JSON.

<details>

<summary>Example</summary>

```js
import { readPackageJson } from '@codemod-utils/json';

function analyzePackageJson(codemodOptions) {
  const {
    dependencies,
    devDependencies,
    'ember-addon': emberAddon,
    name,
    version,
  } = readPackageJson(codemodOptions);

  const projectDependencies = new Map([
    ...Object.entries(dependencies ?? {}),
    ...Object.entries(devDependencies ?? {}),
  ]);

  // Return information that the codemod needs
  return {
    dependencies: projectDependencies,
    hasGlint: projectDependencies.has('@glint/core'),
    hasTypeScript: projectDependencies.has('typescript'),
    isV1Addon: Boolean(emberAddon),
    name,
    version,
  };
}

analyzePackageJson({
  projectRoot: // ...
});
```

</details>


## Compatibility

* Node.js v16 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
