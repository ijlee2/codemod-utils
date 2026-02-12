# @codemod-utils/ember

_Utilities for Ember_


## What is it?

`@codemod-utils/ember` provides methods that can help write codemods for Ember projects.


## API

### camelize

Converts an entity name to camel case. Used for naming the function that is associated with the entity.

```ts
import { camelize } from '@codemod-utils/ember';

const newValue = camelize('ui/form/generate-error-message');

// 'uiFormGenerateErrorMessage'
```


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
