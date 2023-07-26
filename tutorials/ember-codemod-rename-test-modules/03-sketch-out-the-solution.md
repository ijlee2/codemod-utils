# Sketch out the solution

In [the previous chapter](./02-understand-the-folder-structure.md), we got to know a bit about the folder structure and the conventions from `@codemod-utils`.

Before we start writing code (ahem, haphazardly), let's see how we can break the problem (of making test module names consistent) into small steps.

Goals:

- Understand the trade-offs of a codemod
- Cover the usual 80%
- Take a funnel approach


## Trade-offs

But first, ask yourself: Is writing a codemod the right approach?

When you write a codemod, you pay the costs upfront. You have to first create and configure a package, write code, then write tests to test that code. This can take days or weeks. But once you have a codemod that is backed by tests, the returns are manifold. The codemod can update your project in a second and can be reused to help other projects migrate.

Here’s the crux: When your project has many variations in code because it hasn’t been maintained, updating it by hand will be faster. A codemod will run into edge cases that may or may not occur in other projects, and every edge case that you handle is extra code that you have to maintain.

Nonetheless, the ability to help others just might be the deciding factor for you. As a rule of thumb, consider writing a codemod if you can cover the usual 80%.

(Note, a **base case** is a scenario where everything is nice and sunshine. On the contrary, an **edge case** is one with something unexpected.)


## Divide and conquer

Let's assume that writing a codemod is the right approach. Next, we need to have a basic idea of how we'll solve the problem.

Making test module names consistent requires us to:

- Update acceptance tests (files in `tests/acceptance` folder)
- Update integration tests (`tests/integration`)
- Update unit tests (`tests/unit`)

So that's 3 steps to take and maybe 3 base cases to consider.

Actually, the problem is more complex, because the `tests/integration` folder can include tests for a component, helper, or modifier (3 entity types), whereas the `tests/unit` folder can include tests for an adapter, controller, initializer, instance initializer, mixin, model, route, serializer, service, and utility (10 entity types).

What if the end-developer's project follows the pod layout or has placed their test modules incorrectly (e.g. the test module for the `<Ui::Page>` component lives in `tests/integration/page-test.ts` instead of `tests/integration/ui/page-test.ts`)?

Where, O where, do we start?


### Cover the usual 80%

We can simplify the problem by "composing" codemods and ignoring one-off cases.

For example, we ask the end-developer to run [`ember-codemod-pod-to-octane`](https://github.com/ijlee2/ember-codemod-pod-to-octane) first. It's a prerequisite for running our codemod. This way, we know that the files in their `tests` folder follow the Octane layout, and don't have to write fixture files to cover the pod case.

Furthermore, misplacing a test module should be a rare event. Rather than parsing the test file to determine the correct location (extra code and maintenance for us), we ask the end-developer to either (1) correct the location as another prerequisite, or (2) let them clone our repo to handle this edge case.

As we will see later, other edge cases like,

- A mix of JavaScript and TypeScript files
- Files that live in `tests/{acceptance,integration,unit}`, but whose name doesn't have the suffix `-test`
- Files that do have the suffix `-test`, but are empty or doesn't have `module()` with the right arguments

can be addressed "naturally," thanks to the packages from `@codemod-utils`.


### Simplify development

With the right sequence of steps, we can make the codemod more maintainable and extensible. For the initial development, I recommend that you follow a "funnel" approach:

- Write, first, a step that helps you reach the 80% faster
- Write, first, a step that is easier to implement

Recall that, for `ember-codemod-rename-test-modules`, we need to take 3 steps:

- Update acceptance tests
- Update integration tests
- Update unit tests

In our case, all 3 steps cover more or less the same number of cases (1 base case and some edge cases, which can occur in all three). That is, no one step lets you reach the 80% faster than another.

So, instead, we'll write them in the order of easiness. That just happens to be the order shown above (1 entity type for acceptance, 3 for integration, and 10 for unit).

Note, [`ember-codemod-v1-to-v2`](https://github.com/ijlee2/ember-codemod-v1-to-v2) is a good example of ordering the steps by the first criterion, i.e. by how many files they cover (from large to small).

```ts
export function runCodemod(codemodOptions: CodemodOptions): void {
  const options = createOptions(codemodOptions);
  const context = analyzeAddon(options);

  // Preserve code
  moveAddonFiles(options);
  moveTestAppFiles(options);
  moveProjectRootFiles(options);

  // Get the latest code from blueprints
  createFilesFromBlueprints(context, options);

  // Fine-tune individual files
  updateAddonPackageJson(context, options);
  updateAddonTsConfigJson(options);
  updateTestAppPackageJson(options);
  updateTestAppTsConfigJson(options);
}
```


<div align="center">
  <div>
    Next: <a href="./04-create-the-first-step-part-1.md">Create the first step (Part 1)</a>
  </div>
  <div>
    Previous: <a href="./02-understand-the-folder-structure.md">Understand the folder structure</a>
  </div>
</div>
