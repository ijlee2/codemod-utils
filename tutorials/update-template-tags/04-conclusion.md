# Conclusion

Even when `content-tag` doesn't provide a way to update `*.{gjs,gts}` files, you can support these files thanks to `@codemod-utils/ast-template-tag`. The best part? You can reuse code.

As exercise, see if you can update the JavaScript part of a `*.{gjs,gts}` file.

```ts
import { updateJavaScript } from '@codemod-utils/ast-template-tag';

function transform(file: string): string {
  // ...
}

let file = readFileSync(join(projectRoot, filePath), 'utf8');

file = updateJavaScript(file, transform);
```

How would you tell `transform()` whether the file is in TypeScript (`*.gts`)?

<details>

<summary>How to pass data</summary>

```ts
import { updateJavaScript } from '@codemod-utils/ast-template-tag';

type Data = {
  isTypeScript: boolean;
};

function transform(file: string, data: Data): string {
  // ...
}

let file = readFileSync(join(projectRoot, filePath), 'utf8');

const data = {
  isTypeScript: filePath.endsWith('.gts'),
};

file = updateJavaScript(file, (code) => {
  return transform(code, data);
});
```

</details>
