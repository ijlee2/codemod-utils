[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ast-ast-template-tag

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

### preprocess

Processes a file with `<template>` tags into things that work with existing methods or libraries.

⚠️ Likely, you won't need this method but [`updateJavaScript`](#updatejavascript) instead.

<details>

<summary>Example</summary>

Analyze the JavaScript part of the file.

```ts
const { javascript } = preprocess(file);

// Some method that checks `*.{js,ts}` files
analyze(javascript);
```

</details>

<details>

<summary>Example</summary>

Count the number of lines inside `<template>` tags.

```ts
const { templateTags } = preprocess(file);

let numOfLines = 0;

templateTags.forEach(({ contents }) => {
  numOfLines += contents.trim().split('\n').length;
});
```

</details>


### replaceTemplate

Replaces the template of a particular `<template>` tag.

⚠️ Likely, you won't need this method but [`updateTemplates`](#updatetemplates) instead.

<details>

<summary>Example</summary>

Update the template in each tag.

```ts
const { templateTags } = preprocess(file);

templateTags.reverse().forEach(({ contents, range }) => {
  // Some method that can update `*.hbs` files
  const template = transform(contents);

  file = replaceTemplate(file, { range, template });
});
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

const newFile = updateJavaScript(oldFile, (file) => {
  return transform(file, data);
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

const newFile = updateTemplates(oldFile, (file) => {
  return transform(file, data);
});
```

</details>


## Compatibility

- Node.js v20 or above


## Contributing

See the [Contributing](../../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
