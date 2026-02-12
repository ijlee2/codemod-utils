# @codemod-utils/package-json

_Utilities for handling `package.json`_


## What is it?

`@codemod-utils/package-json` helps you read and update `package.json`.


## API

### convertToMap {#api-convert-to-map}

Converts an object to a Map. Use it along with [`convertToObject`](#api-convert-to-object) to update objects in `package.json`.

::: code-group

```ts [Signature]
/**
 * @param object
 *
 * An object.
 *
 * @return
 *
 * The object as a Map.
 */
function convertToMap(object?: {}): Map<string, unknown>;
```

```ts [Example]{4}
/**
 * Remove dependencies (if they exist) from `package.json`.
 */
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

:::

 
### convertToObject {#api-convert-to-object}

Converts a Map (back) to an object. Use it along with `convertToMap` to update objects in `package.json`.

::: code-group

```ts [Signature]
/**
 * @param object
 *
 * A Map.
 *
 * @return
 *
 * The Map as an object. (The object keys are sorted in alphabetical
 * order.)
 */
function convertToObject(map?: Map<any, any>): any;
```

```ts [Example]{17}
/**
 * Remove dependencies (if they exist) from `package.json`.
 */
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

:::


### getPackageType {#api-get-package-type}

Determines package type based on Ember's conventions.

Possible values are `'node'`, `'v1-addon'`, `'v1-app'`, `'v2-addon'`, or `'v2-app'`.

::: code-group

```ts [Signature]
/**
 * @param packageJson
 *
 * A JSON that represents `package.json`.
 *
 * @return
 *
 * A string that represents package type (`'node'`, `'v1-addon'`,
 * `'v1-app'`, `'v2-addon'`, or `'v2-app'`).
 */
function getPackageType(packageJson: PackageJson): PackageType;
```

```ts [Example]
/**
 * Make an early exit in a codemod that converts v1 addons to v2.
 */
const packageType = getPackageType(packageJson);

if (packageType === 'v2-addon') {
  return;
}

// Convert to v2
```

:::


### readPackageJson {#api-read-package-json}

Reads `package.json` and returns the parsed JSON.

> [!IMPORTANT]
>
> `readPackageJson` checks that `package.json` exists and is a valid JSON.

::: code-group

```ts [Signature]
/**
 * @param options
 *
 * An object with `projectRoot`.
 *
 * @return
 *
 * A JSON that represents `package.json`.
 */
function readPackageJson(options: Options): PackageJson;
```

```ts [Example]
/**
 * Check if a project has `typescript` as a dependency.
 */
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

:::


### validatePackageJson {#api-validate-package-json}

(Type-)Checks that the fields `name` and `version` exist, in the sense that their values are a non-empty string.

::: code-group

```ts [Signature]
/**
 * @param packageJson
 *
 * A JSON that represents `package.json`.
 */
function validatePackageJson(
  packageJson: PackageJson,
): asserts packageJson is ValidatedPackageJson;
```

```ts [Example]
import {
  readPackageJson,
  validatePackageJson,
} from '@codemod-utils/package-json';

const packageJson = readPackageJson({ projectRoot });

validatePackageJson(packageJson);

// Both guaranteed to be `string` (not `undefined`)
const { name, version } = packageJson;
```

:::
