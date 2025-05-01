[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/blueprints

_Utilities for blueprints_


## What is it?

Are there files that you _always_ need, in order to create or update projects? `@codemod-utils/blueprints` helps you define these files and provide user-specific data (context).


## API

### decideVersion

Returns the version that can be installed for a package.

Always favors the current version in the user's project (a no-op). Uses the latest version only if the project doesn't depend on the package yet.

> [!NOTE]
> It is assumed that:
>
> - You don't want to rely on a library such as [`latest-version`](https://www.npmjs.com/package/latest-version). (The reasons are, your codemod would have an extra dependency and your tests may fail without stubs—more dependencies.)
> - Before calling `decideVersion`, the codemod has computed `dependencies` (current dependencies of the user's project) and stored `latestVersions` (versions to install by default) somewhere.

<details>

<summary>Example</summary>

First, pass `latestVersions` to `decideVersion()`.

```ts
import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['embroider-css-modules', '1.0.0'],
  ['webpack', '5.89.0'],
]);

// Create a wrapper
function getVersion(packageName, options) {
  const { dependencies } = options;

  return decideVersion(packageName, {
    dependencies,
    latestVersions,
  });
}
```

Then, pass `dependencies` to `decideVersion()`.

```ts
const options = {
  dependencies: new Map([
    ['webpack', '^5.82.0'],
  ]),
};

getVersion('embroider-css-modules', options); // '^1.0.0'
getVersion('webpack', options); // '^5.82.0' (no-op)
```

</details>


### getFilePath

Returns where `npx` installs the codemod on the user's machine.

<details>

<summary>Example</summary>

To read blueprint files, get the path to the `blueprints` folder.

```ts
/* src/utils/blueprints/blueprints-root.ts */
import { join } from 'node:path';

import { getFilePath } from '@codemod-utils/blueprints';

const fileURL = import.meta.url;

const blueprintsRoot = join(getFilePath(fileURL), '../../blueprints');

// '<some/absolute/path>/src/blueprints'
```

Afterwards, prepend the file path with `blueprintsRoot`.

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const blueprintFilePaths = ['LICENSE.md', 'README.md'];

blueprintFilePaths.forEach((blueprintFilePath) => {
  const blueprintFile = readFileSync(
    join(blueprintsRoot, blueprintFilePath),
    'utf8',
  );
});
```

</details>


### processTemplate

Often, blueprints need context: If some condition is true, a file should be generated in a different way. You can [embed logic with delimiters](https://lodash.com/docs/#template) in the blueprint files, then use `processTemplate` to pass data.

There are 3 types of delimiters:

- Escape (`<%- %>`) - escape an HTML code
- Evaluate (`<% %>`) - evaluate a JavaScript code
- Interpolate (`<%= %>`) - substitute a value

<details>

<summary>Example</summary>

First, create a blueprint file.

```ts
/* blueprints/__testAppLocation__/ember-cli-build.js */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    autoImport: {
      watchDependencies: ['<%= addon.name %>'],
    },<% if (testApp.hasTypeScript) { %>
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },<% } %>
  });

  const { maybeEmbroider } = require('@embroider/test-setup');

  return maybeEmbroider(app);
};
```

Then, pass data to the file.

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { processTemplate } from '@codemod-utils/blueprints';

// Read file
const blueprintFilePath = '__testAppLocation__/ember-cli-build.js';

const blueprintFile = readFileSync(
  join(blueprintsRoot, blueprintFilePath),
  'utf8',
);

// Process file
processTemplate(blueprintFile, {
  addon: {
    name: 'ember-container-query',
  },
  app: {
    hasTypeScript: true,
  },
});
```

</details>

Often, it is easy to miscalculate data and misplace the newline character `\n` . If you intend to publish your codemod, I recommend using [`@codemod-utils/tests`](../tests) (create and test file fixtures) to check the output and prevent regressions.


## Compatibility

- Node.js v20 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
