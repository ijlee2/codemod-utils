# Tackle `*.{gjs,gts}`

Now that we have a method for updating `*.hbs` files, we can reuse it to update `*.{gjs,gts}` files.


## Use @codemod-utils/ast-template-tag

The addon provides a utility called [`updateTemplates`](../../packages/codemod-utils-ast-template-tag#api-update-templates). It updates the `<template>` tags in a file and leaves the JavaScript part alone.

::: code-group

```diff [src/steps/remove-test-selectors.ts]
+ import { updateTemplates } from '@codemod-utils/ast-template-tag';

function removeDataTestAttributes(file: string): string {
  // ...
}

let file = readFileSync(join(projectRoot, filePath), 'utf8');

if (filePath.endsWith('.hbs')) {
  file = removeDataTestAttributes(file);
+ } else {
+   file = updateTemplates(file, removeDataTestAttributes);
}
```

:::

Easy, no? Run `update-test-fixtures.sh` once more to check whether

- The remaining file (`app/components/my-component.gjs`) is updated.
- Only the test selectors were removed.
- Formatting is preserved.

::: code-group

```diff [tests/fixtures/sample-project/output/app/components/my-component.gjs]
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import styles from './my-component.css';

const Control =
<template>
  <div class={{styles.control}}>
    <button
-       data-test-button="Increment"
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
-       <p class={{styles.count}} data-test-count ...attributes>
+       <p class={{styles.count}} ...attributes>
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
-         <Display @count={{this.count}} data-test-my-count />
+         <Display @count={{this.count}} />
      </div>
    </template>
}
```

:::


## Under the hood

`@codemod-utils/ast-template-tag` knows the locations of `<template>` tags in a file. To see this in action, you can call a low-level utility called `findTemplateTags`.

::: code-group

```diff [src/steps/remove-test-selectors.ts]
- import { updateTemplates } from '@codemod-utils/ast-template-tag';
+ import { findTemplateTags, updateTemplates } from '@codemod-utils/ast-template-tag';

function removeDataTestAttributes(file: string): string {
  // ...
}

let file = readFileSync(join(projectRoot, filePath), 'utf8');

if (filePath.endsWith('.hbs')) {
  file = removeDataTestAttributes(file);
} else {
+   const templateTags = findTemplateTags(file);
+
+   templateTags.forEach((templateTag) => {
+     console.log(templateTag);
+   });
+
  file = updateTemplates(file, removeDataTestAttributes);
}
```

:::

`templateTags` is an array of objects. Run tests again to see what the object looks like.

<details>

<summary>Expected output</summary>

`my-component.gjs` has 3 `<template>` tags, so `templateTags` has 3 elements. The object keys that matter to us are `contents` and `range`.

```sh {:no-line-numbers}
❯ pnpm test

{
  type: 'expression',
  tagName: 'template',
  contents: '\n' +
    '  <div class={{styles.control}}>\n' +
    '    <button\n' +
    '      data-test-button="Increment"\n' +
    '      type="button"\n' +
    '      {{on "click" @onClick}}\n' +
    '    >\n' +
    '      Increment by 1\n' +
    '    </button>\n' +
    '  </div>\n',
  range: {
    startByte: 186,
    endByte: 388,
    startChar: 186,
    endChar: 388,
    startUtf16Codepoint: 186,
    endUtf16Codepoint: 388
  },
  startRange: {
    startByte: 186,
    endByte: 196,
    startChar: 186,
    endChar: 196,
    startUtf16Codepoint: 186,
    endUtf16Codepoint: 196
  },
  contentRange: {
    startByte: 196,
    endByte: 377,
    startChar: 196,
    endChar: 377,
    startUtf16Codepoint: 196,
    endUtf16Codepoint: 377
  },
  endRange: {
    startByte: 377,
    endByte: 388,
    startChar: 377,
    endChar: 388,
    startUtf16Codepoint: 377,
    endUtf16Codepoint: 388
  }
}
{
  type: 'expression',
  tagName: 'template',
  contents: '\n' +
    '    <div class={{styles.display}}>\n' +
    '      Count:\n' +
    '      <p class={{styles.count}} data-test-count ...attributes>\n' +
    '        {{@count}}\n' +
    '      </p>\n' +
    '    </div>\n' +
    '  ',
  range: {
    startByte: 408,
    endByte: 584,
    startChar: 408,
    endChar: 584,
    startUtf16Codepoint: 408,
    endUtf16Codepoint: 584
  },
  startRange: {
    startByte: 408,
    endByte: 418,
    startChar: 408,
    endChar: 418,
    startUtf16Codepoint: 408,
    endUtf16Codepoint: 418
  },
  contentRange: {
    startByte: 418,
    endByte: 573,
    startChar: 418,
    endChar: 573,
    startUtf16Codepoint: 418,
    endUtf16Codepoint: 573
  },
  endRange: {
    startByte: 573,
    endByte: 584,
    startChar: 573,
    endChar: 584,
    startUtf16Codepoint: 573,
    endUtf16Codepoint: 584
  }
}
{
  type: 'class-member',
  tagName: 'template',
  contents: '\n' +
    '      <div class={{styles.container}}>\n' +
    '        <Control\n' +
    '          @onClick={{this.increment}}\n' +
    '          />\n' +
    '        <Display @count={{this.count}} data-test-my-count />\n' +
    '      </div>\n' +
    '    ',
  range: {
    startByte: 711,
    endByte: 918,
    startChar: 711,
    endChar: 918,
    startUtf16Codepoint: 711,
    endUtf16Codepoint: 918
  },
  startRange: {
    startByte: 711,
    endByte: 721,
    startChar: 711,
    endChar: 721,
    startUtf16Codepoint: 711,
    endUtf16Codepoint: 721
  },
  contentRange: {
    startByte: 721,
    endByte: 907,
    startChar: 721,
    endChar: 907,
    startUtf16Codepoint: 721,
    endUtf16Codepoint: 907
  },
  endRange: {
    startByte: 907,
    endByte: 918,
    startChar: 907,
    endChar: 918,
    startUtf16Codepoint: 907,
    endUtf16Codepoint: 918
  }
}
```

</details>

> [!NOTE]
>
> Because `range.startByte` is monotonically increasing, we can assume that `templateTags` is a sorted array. The `<template>` tag, which appears first in a file, appears first in the array.
>
> To avoid bugs due to line and character positions, we need to update the file's templates in the opposite order (from last to first). `updateTemplates` handles this for us.
