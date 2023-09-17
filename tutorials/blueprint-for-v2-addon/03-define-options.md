# Define options

Recall from [the previous chapter](./02-create-static-files.md) that we want the addons to live in `packages` and the test apps in `tests`.

```sh
workspace-root
├── packages
│   ├── addon-1
│   ├── addon-2
│   ├── ...
│   └── addon-n
└── tests
    ├── test-app-for-addon-1
    ├── test-app-for-addon-2
    ├── ...
    └── test-app-for-addon-n
```

Currently, our codemod doesn't take these requirements into account. It also hard-codes the package names `addon-1` and `test-app-for-addon-1` in `package.json`.

```sh
workspace-root
├── __addonLocation__ ❌
│   └── package.json ❌
└── __testAppLocation__ ❌
    └── package.json ❌
```

In this chapter, we'll update the codemod so that our users can specify the name and location of their new addon. We can then derive the name and location of the corresponding test app.

Goals:

- Use `yargs` to read codemod options
- Store codemod options
- Transform codemod options


## Read codemod options

[`yargs`](https://yargs.js.org/) helps us provide a command-line interface to our users (e.g. they can pass `--help` to learn the possible options). It also helps us parse and validate their desired options.

Open the executable file in the `bin` folder.

<details>

<summary><code>bin/blueprint-for-v2-addon.ts</code></summary>

```ts
#!/usr/bin/env node
// eslint-disable-next-line n/shebang
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { runCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = 'blueprint-for-v2-addon';

// Set codemod options
const argv = yargs(hideBin(process.argv))
  .option('root', {
    describe: 'Where to run the codemod',
    type: 'string',
  })
  .parseSync();

const codemodOptions: CodemodOptions = {
  projectRoot: argv['root'] ?? process.cwd(),
};

runCodemod(codemodOptions);
```

</details>

From the line `.option('root')`, we see that `@codemod-utils/cli` has defined an option (an **argument**) called `--root`. The argument value, `argv['root']`, is stored in `codemodOptions.projectRoot`.

> [!NOTE]
> The argument `root` is renamed to `projectRoot`, in order to help our users type a short command. The renamed variable also helps us understand what the word "root" actually means.
>
> In general, prefer argument names that are descriptive and ideal in length. The same names (in camel case) should be used to name the keys of `codemodOptions`.

Take a look at the documentation for [`.option()`](https://yargs.js.org/docs/#api-reference-optionskey-opt). Then, create 2 more options: `--addon-location` and `--addon-name`. Specify that these options expect a string and are required. (For now, leave `codemodOptions` as is.)

<details>

<summary>Solution: <code>bin/blueprint-for-v2-addon.ts</code></summary>

```diff
#!/usr/bin/env node
// eslint-disable-next-line n/shebang
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { runCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = 'blueprint-for-v2-addon';

// Set codemod options
const argv = yargs(hideBin(process.argv))
+   .option('addon-location', {
+     demandOption: true,
+     describe: "Location of the addon package (e.g. 'ui/button')",
+     type: 'string',
+   })
+   .option('addon-name', {
+     demandOption: true,
+     describe: "Name of the addon package (e.g. '@my-ui/button')",
+     type: 'string',
+   })
  .option('root', {
    describe: 'Where to run the codemod',
    type: 'string',
  })
  .parseSync();

const codemodOptions: CodemodOptions = {
  projectRoot: argv['root'] ?? process.cwd(),
};

runCodemod(codemodOptions);
```

</details>


## Store codemod options

Recall that `argv` has the argument values. Update the executable file so that `codemodOptions` includes the addon's name and location. (Which other files need to be updated, in order for `lint` and `test` to pass?)

<details>

<summary>Solution: <code>bin/blueprint-for-v2-addon.ts</code></summary>

```diff
#!/usr/bin/env node
// eslint-disable-next-line n/shebang
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { runCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = 'blueprint-for-v2-addon';

// Set codemod options
const argv = yargs(hideBin(process.argv))
  .option('addon-location', {
    demandOption: true,
    describe: "Location of the addon package (e.g. 'ui/button')",
    type: 'string',
  })
  .option('addon-name', {
    demandOption: true,
    describe: "Name of the addon package (e.g. '@my-ui/button')",
    type: 'string',
  })
  .option('root', {
    describe: 'Where to run the codemod',
    type: 'string',
  })
  .parseSync();

const codemodOptions: CodemodOptions = {
+   addonLocation: argv['addon-location'],
+   addonName: argv['addon-name'],
  projectRoot: argv['root'] ?? process.cwd(),
};

runCodemod(codemodOptions);
```

</details>

<details>

<summary>Solution: <code>src/types/index.ts</code></summary>

```diff
type CodemodOptions = {
+   addonLocation: string;
+   addonName: string;
  projectRoot: string;
};

type Options = {
  projectRoot: string;
};

export type { CodemodOptions, Options };
```

</details>

<details>

<summary>Solution: <code>tests/helpers/shared-test-setups/sample-project.ts</code></summary>

```diff
import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
+   addonLocation: 'ui/button',
+   addonName: '@my-ui/button',
  projectRoot: 'tmp/sample-project',
};

const options: Options = {
  projectRoot: 'tmp/sample-project',
};

export { codemodOptions, options };
```

</details>


## Transform codemod options

While `codemodOptions` stores a user's desired options (`argv`) almost in a 1-1 fashion, `options` allows us to group the options differently, so that the code that we write is easier to read and makes more logical sense.

The `create-options` step is where we can transform codemod options. By default, `options` is an exact copy of `codemodOptions`.

<details>

<summary><code>src/steps/create-options.ts</code></summary>

```ts
import type { CodemodOptions, Options } from '../types/index.js';

export function createOptions(codemodOptions: CodemodOptions): Options {
  const { projectRoot } = codemodOptions;

  return {
    projectRoot,
  };
}
```

</details>

Let's update `createOptions()` so that `options.packages` uses a nested object to record the names and locations of the addon and test app.

```ts
import type { CodemodOptions, Options } from '../types/index.js';

export function createOptions(codemodOptions: CodemodOptions): Options {
  const { addonLocation, addonName, projectRoot } = codemodOptions;

  return {
    packages: {
      addon: {
        location: ...,
        name: ...,
      },
      testApp: {
        location: ...,
        name: ...,
      },
    },
    projectRoot,
  };
}
```

See if you can complete the starter code shown above. The requirements are:

- The addon lives in `packages`.
- The test app lives in `tests`.
- The test app's name is `test-app-for-${dasherize(addonName)}`.

<details>

<summary>Solution: <code>src/steps/create-options.ts</code></summary>

```diff
+ import { join } from 'node:path';
+ 
import type { CodemodOptions, Options } from '../types/index.js';

+ function dasherize(packageName: string): string {
+   return packageName.replace('@', '').replace(/\W|_/g, '-');
+ }
+ 
export function createOptions(codemodOptions: CodemodOptions): Options {
-   const { projectRoot } = codemodOptions;
+   const { addonLocation, addonName, projectRoot } = codemodOptions;
 
  return {
+     packages: {
+       addon: {
+         location: join('packages', addonLocation),
+         name: addonName,
+       },
+       testApp: {
+         location: join('tests', addonLocation),
+         name: `test-app-for-${dasherize(addonName)}`,
+       },
+     },
    projectRoot,
  };
}
```

</details>

<details>

<summary>Solution: <code>src/types/index.ts</code></summary>

```diff
type CodemodOptions = {
  addonLocation: string;
  addonName: string;
  projectRoot: string;
};

type Options = {
+   packages: {
+     addon: {
+       location: string;
+       name: string;
+     };
+     testApp: {
+       location: string;
+       name: string;
+     };
+   };
  projectRoot: string;
};

export type { CodemodOptions, Options };
```

</details>


<div align="center">
  <div>
    Next:
  </div>
  <div>
    Previous: <a href="./02-create-static-files.md">Create static files</a>
  </div>
</div>
