# Create a project

For simplicity, we'll assume our target project to be an Ember app. That is, the relevant files live in the `app` folder.


## Use the CLI

Change the directory to a place where you like to keep projects. Then, run these commands:

```sh
# Create project
npx @codemod-utils/cli remove-test-selectors --addon ast-template ast-template-tag

# Install dependencies
cd remove-test-selectors
pnpm install
```

> [!NOTE]
> Just like in [the main tutorial](../main-tutorial/04-step-1-update-acceptance-tests-part-1.md#remove-the-sample-step), remove the sample step, `add-end-of-line`.


## Scaffold step

Create a step called `remove-test-selectors`. It is to read `*.{gjs,gts,hbs}` files and write back the file content (a no-op).

<details>

<summary><code>src/steps/remove-test-selectors.ts</code></summary>

For brevity, how `src/index.ts` calls `removeTestSelectors()` is not shown.

```ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

function removeDataTestAttributes(file: string): string {
  return file;
}

export function removeTestSelectors(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('app/**/*.{gjs,gts,hbs}', {
    projectRoot,
  });

  const fileMap = new Map(
    filePaths.map((filePath) => {
      let file = readFileSync(join(projectRoot, filePath), 'utf8');

      file = removeDataTestAttributes(file);

      return [filePath, file];
    }),
  );

  createFiles(fileMap, options);
}
```

</details>

To test the step, we'll create a component with 3 `<template>` tags and render it in the `index` route.

<details>

<summary><code>tests/fixtures/sample-project/input/app/components/my-component.gjs</code></summary>

The indentations are inconsistent on purpose. We'll check that formatting is preserved.

```js
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import styles from './my-component.css';

const Control =
<template>
  <div class={{styles.control}}>
    <button
      data-test-button="Increment"
      type="button"
      {{on "click" @onClick}}
    >
      Increment by 1
    </button>
  </div>
</template>

const Display =
  <template>
    <div class={{styles.display}}>
      Count:
      <p class={{styles.count}} data-test-count ...attributes>
        {{@count}}
      </p>
    </div>
  </template>

export default class MyComponent extends Component {
  @tracked count = 0;

  increment = () => {
    this.count++;
  }

    <template>
      <div class={{styles.container}}>
        <Control
          @onClick={{this.increment}}
          />
        <Display @count={{this.count}} data-test-my-count />
      </div>
    </template>
}
```

</details>

<details>

<summary><code>tests/fixtures/sample-project/input/app/templates/index.hbs</code></summary>

```hbs
<div data-test-my-component>
  <MyComponent />
</div>
```

</details>


<div align="center">
  <div>
    Next: <a href="./02-tackle-hbs.md">Tackle <code>*.hbs</code></a>
  </div>
  <div>
    Previous: <a href="./00-introduction.md">Introduction</a>
  </div>
</div>
