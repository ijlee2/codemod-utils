# @codemod-utils/blueprints

_Utilities for blueprints_


## What is it?

`@codemod-utils/blueprints` helps you create blueprints, files that you use like a "stamp" to create or update files.


## API

### decideVersion {#api-decide-version}

Returns the version that can be installed for a package.

Always favors the current version in the user's project (a no-op). Uses the latest version only if the project doesn't depend on the package yet.

::: code-group

```ts [Signature]
/**
 *
 * @param packageName
 *
 * Name of the package.
 *
 * @param options
 *
 * An object with `dependencies` (the current versions in the user's
 * project) and `latestVersions` (the versions to install by default).
 *
 * @return
 *
 * The version to install.
 */
function decideVersion(
  packageName: PackageName,
  options: {
    dependencies: Map<PackageName, PackageVersion>;
    latestVersions: Map<PackageName, PackageVersion>;
  },
): PackageVersion;
```

```ts [Example (Utility)]
import { decideVersion } from '@codemod-utils/blueprints';

const latestVersions = new Map([
  ['embroider-css-modules', '1.0.0'],
  ['webpack', '5.89.0'],
]);

export function getVersion(packageName, options) {
  const { dependencies } = options;

  return decideVersion(packageName, {
    dependencies,
    latestVersions,
  });
}
```

```ts [Example (Consumer)]
const options = {
  dependencies: new Map([
    ['webpack', '^5.82.0'],
  ]),
};

getVersion('embroider-css-modules', options); // '^1.0.0'
getVersion('webpack', options); // '^5.82.0' (no-op)
```

:::

> [!NOTE]
>
> The example above assumes that:
>
> - You don't want to rely on a library such as [`latest-version`](https://www.npmjs.com/package/latest-version). (The reasons are, your codemod would have an extra dependency and your tests may fail without stubs—more dependencies.)
> - Before calling `decideVersion`, the codemod has computed `dependencies` (current dependencies of the user's project) and stored `latestVersions` (versions to install by default) somewhere.


### getFilePath {#api-get-file-path}

Returns where the codemod ends up being installed on the user's machine.

::: code-group

```ts [Signature]
/**
 * @param fileURL
 *
 * Pass the value of `import.meta.url`.
 *
 * @return
 *
 * The installation path.
 */
function getFilePath(fileURL: string): string;
```

```ts [Example (Utility)]
import { join } from 'node:path';

import { getFilePath } from '@codemod-utils/blueprints';

const fileURL = import.meta.url;

export const blueprintsRoot = join(getFilePath(fileURL), '../../blueprints');
```

```ts [Example (Consumer)]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { blueprintsRoot } from '../../some-path';

const blueprintFilePaths = ['LICENSE.md', 'README.md'];

blueprintFilePaths.forEach((blueprintFilePath) => {
  const blueprintFile = readFileSync(
    join(blueprintsRoot, blueprintFilePath),
    'utf8',
  );
});
```

:::


### processTemplate {#api-process-template}

Returns the blueprint file after filling it out with data.

::: code-group

```ts [Signature]
/**
 * @param file
 *
 * A blueprint file, which may contain escape, evaluate, and
 * interpolate delimiters.
 *
 * - Escape (`<%- %>`) - escape an HTML code
 * - Evaluate (`<% %>`) - evaluate a JavaScript code
 * - Interpolate (`<%= %>`) - substitute a value
 *
 * @param data
 *
 * An object that provides the data needed for the file.
 *
 * @return
 *
 * The processed blueprint file.
 */
function processTemplate(file: string, data?: object): string;
```

```js [Example (Blueprint)]{10,11-14}
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

```ts [Example (Consumer)]
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

:::
