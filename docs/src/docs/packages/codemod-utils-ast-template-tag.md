# @codemod-utils/ast-template-tag

_Utilities for handling `*.{gjs,gts}` files_


## What is it?

`@codemod-utils/ast-template-tag` uses [`content-tag`](https://github.com/embroider-build/content-tag) to help you parse and transform `*.{gjs,gts}` files.

::: code-group

```ts [How to update JavaScript]
import { updateJavaScript } from '@codemod-utils/ast-template-tag';

// Reuse a method that can update `*.{js,ts}` files
function transform(file: string): string {
  // ...
}

const newFile = updateJavaScript(oldFile, transform);
```

```ts [How to update templates]
import { updateTemplates } from '@codemod-utils/ast-template-tag';

// Reuse a method that can update `*.hbs` files
function transform(file: string): string {
  // ...
}

const newFile = updateTemplates(oldFile, transform);
```

:::


## API

### findTemplateTags {#api-find-template-tags}

Finds `<template>` tags in a file.

::: code-group

```ts [Signature]
/**
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @return
 *
 * A sorted array that tracks tag contents and locations.
 */
function findTemplateTags(file: string): TemplateTag[];
```

```ts [Example]
/**
 * Count the number of lines of code (LOC) in `<template>` tags.
 */
function getLOC(file: string): number {
  const matches = file.match(/\r?\n/g);

  return (matches ?? []).length;
}

const templateTags = findTemplateTags(file);

let loc = 0;

templateTags.forEach(({ contents }) => {
  loc += getLOC(contents.trim());
});
```

:::


### replaceTemplateTag {#api-replace-template-tag}

Replaces a particular `<template>` tag.

> [!NOTE]
>
> Likely, you won't need this method but [`updateTemplates`](#api-update-templates) instead.

::: code-group

```ts [Signature]
/**
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @param data
 *
 * An object with `range` (tag location) and `code` (what to
 * replace with).
 *
 * @return
 *
 * The resulting file.
 */
function replaceTemplateTag(
  file: string,
  data: {
    code: string;
    range: Range;
  },
): string;

```

```ts [Example]
/**
 * Update all template tags in a file.
 */
const templateTags = findTemplateTags(file);

templateTags.reverse().forEach(({ contents, range }) => {
  // Some method that can update `*.hbs` files
  const template = transform(contents);

  file = replaceTemplateTag(file, {
    code: `<template>${template}</template>`,
    range,
  });
});
```

:::


### toEcma {#api-to-ecma}

Converts a file with `<template>` tags to ECMAScript (JavaScript).

> [!NOTE]
>
> Likely, you won't need this method but [`updateJavaScript`](#api-update-javascript) instead.

::: code-group

```ts [Signature]
/**
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @return
 *
 * File in standard JavaScript.
 */
function toEcma(file: string): string;
```

```ts [Example]
/**
 * Analyze the JavaScript part of the file.
 */
const ecma = toEcma(file);

// Some method that checks `*.{js,ts}` files
analyze(ecma);
```

:::


### toTemplateTag {#api-to-template-tag}

Converts an ECMA file to show `<template>` tags.

> [!NOTE]
>
> Likely, you won't need this method but [`updateTemplates`](#api-update-templates) instead.

::: code-group

```ts [Signature]
/**
 * @param file
 *
 * A `*.{gjs,gts}` file converted to ECMAScript.
 *
 * @return
 *
 * File with `<template>` tags.
 */
function toTemplateTag(file: string): string;
```

```ts [Example]
/**
 * Update `*.{gjs,gts}` files.
 */
// Some method that updates `*.{js,ts}` files
function transform(file: string): string {
  // ...
}

file = toTemplateTag(transform(toEcma(file)));
```

:::


### updateJavaScript {#api-update-javascript}

Updates the JavaScript part of a file. Leaves the `<template>` tags alone.

::: code-group

```ts [Signature]
/**
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @param update
 *
 * A method that describes how to update code.
 *
 * @return
 *
 * The resulting file.
 */
function updateJavaScript(
  file: string,
  update: (code: string) => string,
): string;
```

```ts [Example 1]
/**
 * Reuse a method that can update `*.{js,ts}` files.
 */
function transform(file: string): string {
  // ...
}

const newFile = updateJavaScript(oldFile, transform);
```

```ts [Example 2]
/**
 * Provide data when updating file.
 */
type Data = {
  isTypeScript: boolean;
};

function transform(file: string, data: Data): string {
  // ...
}

const data = {
  isTypeScript: filePath.endsWith('.gts'),
};

const newFile = updateJavaScript(oldFile, (code) => {
  return transform(code, data);
});
```

:::


### updateTemplates {#api-update-templates}

Updates the `<template>` tags in a file. Leaves the JavaScript part alone.

::: code-group

```ts [Signature]
/**
 * @param file
 *
 * A `*.{gjs,gts}` file.
 *
 * @param update
 *
 * A method that describes how to update code.
 *
 * @return
 *
 * The resulting file.
 */
function updateTemplates(
  file: string,
  update: (code: string) => string,
): string;
```

```ts [Example 1]
/**
 * Reuse a method that can update `*.hbs` files.
 */
function transform(file: string): string {
  // ...
}

const newFile = updateTemplates(oldFile, transform);
```

```ts [Example 2]
/**
 * Provide data when updating file.
 */
type Data = {
  isTypeScript: boolean;
};

function transform(file: string, data: Data): string {
  // ...
}

const data = {
  isTypeScript: filePath.endsWith('.gts'),
};

const newFile = updateTemplates(oldFile, (code) => {
  return transform(code, data);
});
```

:::
