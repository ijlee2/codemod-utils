# Tackle `*.hbs`

So far, we can read `*.{gjs,gts,hbs}` files and write back their content. How should we remove test selectors?

Let's take small steps by focusing on `*.hbs` first.

::: code-group

```diff [src/steps/remove-test-selectors.ts]
function removeDataTestAttributes(file: string): string {
  return file;
}

let file = readFileSync(join(projectRoot, filePath), 'utf8');

- file = removeDataTestAttributes(file);
+ if (filePath.endsWith('.hbs')) {
+   file = removeDataTestAttributes(file);
+ }
```

:::


## Use @codemod-utils/ast-template

First, update `removeDataTestAttributes` so that it uses [`@codemod-utils/ast-template`](../../packages/codemod-utils-ast-template) and remains a no-op.

::: code-group

```diff [src/steps/remove-test-selectors.ts]
+ import { AST } from '@codemod-utils/ast-template';

function removeDataTestAttributes(file: string): string {
-   return file;
+   const traverse = AST.traverse();
+
+   const ast = traverse(file, {
+     /* Use AST.builders to transform the tree */
+   });
+
+   return AST.print(ast);
}
```

:::

To find the correct visit method, recall that we want to remove attributes if their name starts with `data-test`.

<details>

<summary>Solution</summary>

::: code-group

```diff [src/steps/remove-test-selectors.ts]
import { AST } from '@codemod-utils/ast-template';

function removeDataTestAttributes(file: string): string {
  const traverse = AST.traverse();

  const ast = traverse(file, {
-     /* Use AST.builders to transform the tree */
+     AttrNode(node) {
+       if (!node.name.startsWith('data-test')) {
+         return;
+       }
+
+       return null;
+     },
  });

  return AST.print(ast);
}
```

:::

</details>

Finally, run `update-test-fixtures.sh`. Only the output fixture `app/templates/index.hbs` is updated.

::: code-group

```diff [tests/fixtures/sample-project/output/app/templates/index.hbs]
- <div data-test-my-component>
+ <div>
  <MyComponent />
</div>
```

:::
