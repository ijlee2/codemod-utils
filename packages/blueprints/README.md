[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/blueprints

_Utilities for blueprints_


## What is it?

Are there files that you _always_ need, in order to create or update projects? `@codemod-utils/blueprints` helps you define these files and provide user-specific data (context).


## API

### decideVersion

Need to add or update a dependency? You can use `decideVersion` to know which version to install.

It is assumed that:

- You don't want to rely on a library such as [`latest-version`](https://www.npmjs.com/package/latest-version). (The reasons are, your codemod would have an extra dependency and your tests may fail without stubs—more dependencies.)
- Before calling `decideVersion`, the codemod has computed `dependencies` (current dependencies of the user's project) and stored `latestVersions` (versions to install by default) somewhere.

<details>

<summary>Example</summary>

Step 1. Pass `latestVersions` to `decideVersion`.

```js
import { decideVersion } from '@codemod-utils/blueprints';

// Hardcode the versions
const latestVersions = new Map([
  ['embroider-css-modules', '0.1.2'],
  ['webpack', '5.82.0'],
]);

// Create a wrapper
export function getVersion(packageName, options) {
  const { dependencies } = options;

  return decideVersion(packageName, {
    dependencies,
    latestVersions,
  });
}
```

Step 2. Pass `dependencies` to `decideVersion`.

```js
// `dependencies` obtained from the user's `package.json`
const options = {
  dependencies: new Map([
    ['webpack', '^5.79.0'],
  ]),
};

// Query version
getVersion('embroider-css-modules', options); // '^0.1.2'
getVersion('webpack', options); // '^5.79.0' (no-op)
```

</details>


### getFilePath

When a user runs your codemod with `npx`, where are your blueprint files installed? With `getFilePath`, you don't need to worry about the actual location.

<details>

<summary>Example</summary>

Step 1. Pass `import.meta.url` to `getFilePath`. Append the relative path to your blueprints folder.

```js
import { join } from 'node:path';

import { getFilePath } from '@codemod-utils/blueprints';

const fileURL = import.meta.url;

// Create a wrapper
export const blueprintsRoot = join(getFilePath(fileURL), '../../blueprints');
```

Step 2. Prepend the file path with `blueprintsRoot`.

```js
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Read file
const blueprintFilePath = '__addonLocation__/rollup.config.mjs';

const blueprintFile = readFileSync(
  join(blueprintsRoot, blueprintFilePath),
  'utf8',
);
```

</details>


### processTemplate

Often, blueprints need context: When a condition is true, a file should be generated in a different way. You can [embed logic with delimiters](https://lodash.com/docs/#template) in the blueprint files, then use `processTemplate` to pass data.

There are 3 types of delimiters:

- Escape (`<%- %>`) - escape an HTML code
- Evaluate (`<% %>`) - evaluate a JavaScript code
- Interpolate (`<%= %>`) - substitute a value

<details>

<summary>Example</summary>

Step 1. Indicate how the file should be created.

```js
/* blueprints/__addonLocation__/rollup.config.mjs */
<% if (options.packages.addon.hasTypeScript) { %>import typescript from 'rollup-plugin-ts';<% } else { %>import { babel } from '@rollup/plugin-babel';<% } %>
import copy from 'rollup-plugin-copy';
import { Addon } from '@embroider/addon-dev/rollup';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default {
  output: addon.output(),

  plugins: [
    addon.publicEntrypoints([<%= context.addon.publicEntrypoints.map((filePath) => `'${filePath}'`).join(', ') %>]),

    addon.appReexports([<%= context.addon.appReexports.map((filePath) => `'${filePath}'`).join(', ') %>]),

    addon.dependencies(),

    // ...
  ],
};
```

Step 2. Pass data to the file.

```js
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { processTemplate } from '@codemod-utils/blueprints';

// Read file
const blueprintFilePath = '__addonLocation__/rollup.config.mjs';

const blueprintFile = readFileSync(
  join(blueprintsRoot, blueprintFilePath),
  'utf8',
);

// Process file
processTemplate(blueprintFile, {
  context, // context = { addon: ... }
  options, // options = { packages: ... }
});
```

</details>

Often, it is easy to miscalculate data and misplace the newline character `\n` . If you intend to publish your codemod, I recommend using [`@codemod-utils/tests`](../tests) (create and test file fixtures) to check the output and prevent regressions.


## Compatibility

- Node.js v18 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
