# Conclusion

Though `content-tag` doesn't provide a way to update `*.{gjs,gts}` files, you can still support these files thanks to `@codemod-utils/ast-template-tag`.

The best part? You can reuse code.

As exercise, try updating some JavaScript code in `*.{gjs,gts,js,ts}` files.

```ts
import { updateJavaScript } from '@codemod-utils/ast-template-tag';

function transform(file: string): string {
  // ...
}

let file = readFileSync(join(projectRoot, filePath), 'utf8');

file = updateJavaScript(file, transform);
```

How will you tell `transform` whether a file uses `<template>` tag and TypeScript?

<details>

<summary>Solution</summary>

You can instead use `parseFilePath` from `@codemod-utils/files` to get the file extension and replace `String.endsWith()` with `===`.

::: code-group

```ts [How to pass data]
import { updateJavaScript } from '@codemod-utils/ast-template-tag';

type Data = {
  isTemplateTag: boolean;
  isTypeScript: boolean;
};

function transform(file: string, data: Data): string {
  // ...
}

let file = readFileSync(join(projectRoot, filePath), 'utf8');

const data = {
  isTemplateTag: filePath.endsWith('.gjs') || filePath.endsWith('.gts'),
  isTypeScript: filePath.endsWith('.gts') || filePath.endsWith('.ts'),
};

file = updateJavaScript(file, (code) => {
  return transform(code, data);
});
```

:::

</details>
