# Define options

Recall from [the previous chapter](./02-create-static-files) that we want addons to live in `/packages` and test apps in `/tests`.

```sh {:no-line-numbers}
workspace-root
├── packages
│   ├── addon-1
│   ├── ...
│   └── addon-n
└── tests
    ├── test-app-for-addon-1
    ├── ...
    └── test-app-for-addon-n
```

Currently, our codemod doesn't take this requirement into account. It also hard-codes the package names `addon-1` and `test-app-for-addon-1` in `package.json`.

```sh {:no-line-numbers}
workspace-root
├── __addonLocation__ ❌
│   └── package.json ❌
└── __testAppLocation__ ❌
    └── package.json ❌
```

In this chapter, we'll allow end-developers to provide the name and location of an addon. We can then derive the name and location of the corresponding test app.

Goals:

- Use `yargs` to read codemod options
- Store codemod options
- Transform codemod options


## Read codemod options

[`yargs`](https://yargs.js.org/) helps our codemod provide a CLI (command-line interface) to end-developers. It also helps us parse and validate their desired options.

Open the executable file in the `bin` folder.

::: code-group

```ts [bin/create-v2-addon-repo.ts]{15-18,22}
#!/usr/bin/env node
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { runCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = 'create-v2-addon-repo';

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

:::

The line `.option('root')` means, `root` is an argument and end-developers can pass the flag `--root`. Its value `argv['root']` is stored in `codemodOptions.projectRoot`.

> [!NOTE]
>
> The argument `root` is renamed to `projectRoot` for `codemodOptions` (and for `options` later). This is so that end-developers can enter a shorter command, while the renamed variable makes our code more readable.
>
> In general, prefer argument names that are short and descriptive. Camelize the argument names to derive the keys of `codemodOptions`.

Study the documentation for [`yargs.option`](https://yargs.js.org/docs/#api-reference-optionskey-opt), then create 2 more options: `addon-location` and `addon-name`. These options expect a string and are required. For now, you may leave `codemodOptions` as is.

<details>

<summary>Solution</summary>

::: code-group

```diff [bin/create-v2-addon-repo.ts]
#!/usr/bin/env node
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { runCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = 'create-v2-addon-repo';

// Set codemod options
const argv = yargs(hideBin(process.argv))
+   .option('addon-location', {
+     demandOption: true,
+     describe: "Location of the addon (e.g. 'ui/button')",
+     type: 'string',
+   })
+   .option('addon-name', {
+     demandOption: true,
+     describe: "Name of the addon (e.g. '@my-ui/button')",
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

:::

</details>


## Store codemod options

`argv` holds the values for `--addon-name` and `--addon-location`.

Update the executable so that `codemodOptions` includes the addon's name and location. (Which other files need to be updated, in order for `lint` and `test` to pass?)

<details>

<summary>Solution</summary>

::: code-group

```diff [bin/create-v2-addon-repo.ts]
#!/usr/bin/env node
'use strict';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { runCodemod } from '../src/index.js';
import type { CodemodOptions } from '../src/types/index.js';

// Provide a title to the process in `ps`
process.title = 'create-v2-addon-repo';

// Set codemod options
const argv = yargs(hideBin(process.argv))
  .option('addon-location', {
    demandOption: true,
    describe: "Location of the addon (e.g. 'ui/button')",
    type: 'string',
  })
  .option('addon-name', {
    demandOption: true,
    describe: "Name of the addon (e.g. '@my-ui/button')",
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

```diff [src/types/index.ts]
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

```diff [tests/helpers/shared-test-setups/sample-project.ts]
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

:::

</details>


## Transform codemod options

`codemodOptions`, defined in the executable, uses a flat object to store information.

By default, `options`, which is defined in the `create-options` step, is an exact copy of `codemodOptions`.

::: code-group

```ts [src/steps/create-options.ts]{4,7}
import type { CodemodOptions, Options } from '../types/index.js';

export function createOptions(codemodOptions: CodemodOptions): Options {
  const { projectRoot } = codemodOptions;

  return {
    projectRoot,
  };
}
```

:::

Depending on your needs, you can rename or regroup the keys from `codemodOptions` to create `options`. You may even decide to use a different data structure!

By taking an extra step, we can write the subsequent steps logically and isolate a breaking change to the codemod's options.

> [!IMPORTANT]
>
> `createOptions()` should not modify `codemodOptions`, but instead return a new object. This prevents a test from changing the setup of another test.

Coming back to our codemod, we want `options` to group the addon's name and location and, similarly, the test app's.

::: code-group

```ts [src/steps/create-options.ts]{6-16}
import type { CodemodOptions, Options } from '../types/index.js';

export function createOptions(codemodOptions: CodemodOptions): Options {
  const { addonLocation, addonName, projectRoot } = codemodOptions;

  return {
    addon: {
      location: ...,
      name: ...,
    },
    projectRoot,
    testApp: {
      location: ...,
      name: ...,
    },
  };
}
```

:::

Complete the code shown above. Recall the additional requirements:

- The addon lives in `/packages`.
- The test app lives in `/tests` (its path mirrors the addon's).
- The test app's name is `test-app-for-${dasherize(addon.name)}`.

<details>

<summary>Solution</summary>

::: code-group

```diff [src/steps/create-options.ts]
+ import { join, sep } from 'node:path';
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
+     addon: {
+       location: join('packages', addonLocation).replaceAll(sep, '/'),
+       name: addonName,
+     },
    projectRoot,
+     testApp: {
+       location: join('tests', addonLocation).replaceAll(sep, '/'),
+       name: `test-app-for-${dasherize(addonName)}`,
+     },
  };
}
```

```diff [src/types/index.ts]
type CodemodOptions = {
  addonLocation: string;
  addonName: string;
  projectRoot: string;
};

type Options = {
+   addon: {
+     location: string;
+     name: string;
+   };
  projectRoot: string;
+   testApp: {
+     location: string;
+     name: string;
+   };
};

export type { CodemodOptions, Options };
```

```diff [tests/helpers/shared-test-setups/sample-project.ts]
import type { CodemodOptions, Options } from '../../../src/types/index.js';

const codemodOptions: CodemodOptions = {
  addonLocation: 'ui/button',
  addonName: '@my-ui/button',
  projectRoot: 'tmp/sample-project',
};

const options: Options = {
+   addon: {
+     location: 'packages/ui/button',
+     name: '@my-ui/button',
+   },
  projectRoot: 'tmp/sample-project',
+   testApp: {
+     location: 'tests/ui/button',
+     name: 'test-app-for-my-ui-button',
+   },
};

export { codemodOptions, options };
```

:::

</details>

In order for `update-test-fixtures.sh` to update the output fixtures, we need to pass `--addon-location` and `--addon-name` like end-developers will.

<details>

<summary>Solution</summary>

::: code-group

```diff [update-test-fixtures.sh]
#!/usr/bin/env sh

#----------
#
#  A. Purpose
#
#    Fix all test fixtures after updating the source code.
#
#  B. Usage
#
#    ./update-test-fixtures.sh
#
#---------

# Compile TypeScript
pnpm build

# Update fixtures
rm -r "tests/fixtures/sample-project/output"
cp -r "tests/fixtures/sample-project/input" "tests/fixtures/sample-project/output"

./dist/bin/create-v2-addon-repo.js \
+   --addon-location "ui/button" \
+   --addon-name "@my-ui/button" \
  --root "tests/fixtures/sample-project/output"
```

:::

</details>

Now that we know the names and locations, we can create the `package.json`'s dynamically and place them in the right folder.
