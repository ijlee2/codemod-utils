# Tackle `*.hbs`

We can read `*.{gjs,gts,hbs}` files and write back their content. How should we now remove test selectors?

Let's take small steps by focusing on `*.hbs`:

```diff
function removeDataTestAttributes(file: string): string {
  return file;
}

let file = readFileSync(join(projectRoot, filePath), 'utf8');

- file = removeDataTestAttributes(file);
+ if (filePath.endsWith('.hbs')) {
+   file = removeDataTestAttributes(file);
+ }
```


## Use `@codemod-utils/ast-template`

First, update `removeDataTestAttributes()` so that it uses [`@codemod-utils/ast-template`](../../packages/ast/template/README.md#what-is-it) and remains a no-op.

```diff
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

To find the correct visit method, recall that we want to remove attributes if their name starts with `data-test`.

<details>

<summary><code>removeDataTestAttributes()</code></summary>

```diff
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

</details>

Finally, run `./update-test-fixtures.sh`. You will see only the file `app/templates/index.hbs` updated.

<details>

<summary><code>tests/fixtures/sample-project/output/app/templates/index.hbs</code></summary>

```diff
- <div data-test-my-component>
+ <div>
  <MyComponent />
</div>
```

</details>


<div align="center">
  <div>
    Next: <a href="./03-tackle-gjs-gts.md">Tackle <code>*.{gjs,gts}</code></a>
  </div>
  <div>
    Previous: <a href="./01-create-a-project.md">Create a project</a>
  </div>
</div>
