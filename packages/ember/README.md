[![This project uses GitHub Actions for continuous integration.](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/ijlee2/codemod-utils/actions/workflows/ci.yml)

# @codemod-utils/ember

_Utilities for Ember_


## What is it?

`@codemod-utils/ember` provides methods that can help write codemods for Ember projects.


## API

The methods are built with the **entity name** in mind, a string (possibly with hyphens and forward slashes) that represents a set of related files in Ember.

(For example, the `<Ui::Form::Input>` component has the entity name `'ui/form/input'`. In the Ember source code, you may see variable names like `entityName` or `moduleName`.)


### doubleColonize

Converts an entity name to double colon (`::`) case. Used for writing the angle bracket syntax or the signature for a component.

```ts
import { doubleColonize } from '@codemod-utils/ember';

const newValue = doubleColonize('ui/form/input');

// 'Ui::Form::Input'
```


### pascalize

Converts an entity name to Pascal case. Used for naming the class that is associated with the entity.

```ts
import { pascalize } from '@codemod-utils/ember';

const newValue = pascalize('ui/form/input');

// 'UiFormInput'
```


## Compatibility

- Node.js v18 or above


## Contributing

See the [Contributing](../../CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
