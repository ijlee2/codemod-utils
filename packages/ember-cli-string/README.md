[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ember-cli-string

_Utilities for string, as used by Ember CLI_


## What is it?

`@codemod-utils/ember-cli-string` provides some methods from [`ember-cli-string-utils`](https://github.com/ember-cli/ember-cli-string-utils), ones that are practical for writing Ember codemods. The code have been simplified and support ESM.


## API

The methods are built with the **entity name** in mind, a string (possibly with hyphens and forward slashes) that represents a set of related files in Ember.

(For example, the `<Ui::Button>` component has the entity name `'ui/button'`. In the Ember source code, you may see variable names like `entityName` or `moduleName`.)


### camelize

Returns a string in camel-case.

```ts
import { camelize } from '@codemod-utils/ember-cli-string';

const newValue = camelize('css-class-name');

// 'cssClassName'
```


### classify

Returns a string that can be used to name a JavaScript `class` (a.k.a. Pascal case).

```ts
import { classify } from '@codemod-utils/ember-cli-string';

const newValue = classify('ui/button');

// 'UiButton'
```


### doubleColonize

Returns a string associated with the angle bracket syntax for components.

```ts
import { doubleColonize } from '@codemod-utils/ember-cli-string';

const newValue = doubleColonize('ui/button');

// 'Ui::Button'
```


## Compatibility

- Node.js v18 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
