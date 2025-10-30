[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ast-template-tag

_Utilities for handling `*.{gjs,gts}` files_


## What is it?

`@codemod-utils/ast-template-tag` uses [`content-tag`](https://github.com/embroider-build/content-tag) to help you parse and transform `*.{gjs,gts}` files.

```ts
import { updateJavaScript } from '@codemod-utils/ast-template-tag';

// Reuse a method that can update `*.{js,ts}` files
function transform(file: string): string {
  // ...
}

const newFile = updateJavaScript(oldFile, transform);
```

```ts
import { updateTemplates } from '@codemod-utils/ast-template-tag';

// Reuse a method that can update `*.hbs` files
function transform(file: string): string {
  // ...
}

const newFile = updateTemplates(oldFile, transform);
```

## API

### findTemplateTags

Finds `<template>` tags in a file.

<details>

<summary>Example</summary>

Count the number of lines of code (LOC) in `<template>` tags.

```ts
function getLOC(code: string): number {
  const matches = file.match(/\r?\n/g);

  return (matches ?? []).length;
}

const templateTags = findTemplateTags(file);

let loc = 0;

templateTags.forEach(({ contents }) => {
  loc += getLOC(contents.trim());
});
```

</details>


### replaceTemplateTag

Replaces a particular `<template>` tag.

⚠️ Likely, you won't need this method but [`updateTemplates`](#updatetemplates) instead.

<details>

<summary>Example</summary>

Update all template tags in a file.

```ts
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

</details>


### toEcma

Converts a file with `<template>` tags to ECMAScript (JavaScript).

⚠️ Likely, you won't need this method but [`updateJavaScript`](#updatejavascript) instead.

<details>

<summary>Example</summary>

Analyze the JavaScript part of the file.

```ts
const ecma = toEcma(file);

// Some method that checks `*.{js,ts}` files
analyze(ecma);
```

</details>


### toTemplateTag

Converts an ECMA file to show `<template>` tags.

⚠️ Likely, you won't need this method but [`updateJavaScript`](#updatejavascript) instead.

<details>

<summary>Example</summary>

Update `*.{gjs,gts}` files.

```ts
// Some method that updates `*.{js,ts}` files
function transform(file: string): string {
  // ...
}

file = toTemplateTag(transform(toEcma(file)));
```

</details>


### updateJavaScript

Updates the JavaScript part of a file. Leaves the `<template>` tags alone.

<details>

<summary>Example</summary>

Reuse a method that can update `*.{js,ts}` files.

```ts
function transform(file: string): string {
  // ...
}

const newFile = updateJavaScript(oldFile, transform);
```

</details>

<details>

<summary>Example</summary>

Provide data when updating file.

```ts
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

</details>


### updateTemplates

Updates the `<template>` tags in a file. Leaves the JavaScript part alone.

<details>

<summary>Example</summary>

Reuse a method that can update `*.hbs` files.

```ts
function transform(file: string): string {
  // ...
}

const newFile = updateTemplates(oldFile, transform);
```

</details>

<details>

<summary>Example</summary>

Provide data when updating file.

```ts
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

</details>


## Compatibility

- Node.js v20 or above


## Contributing

See the [Contributing](../../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
