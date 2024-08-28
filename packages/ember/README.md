[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ember

_Utilities for Ember_


## What is it?

`@codemod-utils/ember` provides methods that can help write codemods for Ember projects.


## API

The methods are built with the **entity name** in mind, a string (possibly with hyphens and forward slashes) that represents a set of related files in Ember.

(For example, the `<Ui::Button>` component has the entity name `'ui/button'`. In the Ember source code, you may see variable names like `entityName` or `moduleName`.)


### classify

Returns a string that can be used to name a JavaScript `class` (a.k.a. Pascal case).

```ts
import { classify } from '@codemod-utils/ember';

const newValue = classify('ui/button');

// 'UiButton'
```


### doubleColonize

Returns a string associated with the angle bracket syntax for components.

```ts
import { doubleColonize } from '@codemod-utils/ember';

const newValue = doubleColonize('ui/button');

// 'Ui::Button'
```


## Compatibility

- Node.js v18 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
