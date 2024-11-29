# Conclusion

When utilities form the foundation of a codemod, we can experiment with new libraries and write code that stands the test of time.

In this tutorial, we combined `content-tag` with `@codemod-utils/ast-template` so that we can update templates in `*.{gjs,gts}` files—a feature that neither `content-tag` nor `@codemod-utils` provides just yet.

As exercise, see if you can update classes in `*.{gjs,gts}` (maybe for just 1 specific case) by combining `content-tag` with `@codemod-utils/ast-javascript`.

```ts
/* src/utils/ast/template-tag.ts */
import { Preprocessor } from 'content-tag';

export function extractClass(file: string): string {
  const preprocessor = new Preprocessor();

  // Compiles `<template>` tags to JavaScript
  return preprocessor.process(file).code;
}
```
