# @codemod-utils/ember

_Utilities for Ember_


## What is it?

`@codemod-utils/ember` provides methods that help you write codemods for Ember projects.


## API

### camelize {#api-camelize}

Converts an entity name to camel case. Used for naming the function that is associated with the entity.

::: code-group

```ts [Signature]
/**
 * @param entityName
 *
 * The name of an entity (made up of lowercase letters, hyphen,
 * and forward slash).
 *
 * @return
 *
 * The name in camel case.
 */
function camelize(entityName: string): string;
```

```ts [Example]
import { camelize } from '@codemod-utils/ember';

const newValue = camelize('ui/form/generate-error-message');

// 'uiFormGenerateErrorMessage'
```

:::


### doubleColonize {#api-double-colonize}

Converts an entity name to double colon (`::`) case. Used for writing the angle bracket syntax or the signature for a component.

::: code-group

```ts [Signature]
/**
 * @param entityName
 *
 * The name of an entity (made up of lowercase letters, hyphen,
 * and forward slash).
 *
 * @return
 *
 * The name in double colon case.
 */
function doubleColonize(entityName: string): string;
```

```ts [Example]
import { doubleColonize } from '@codemod-utils/ember';

const newValue = doubleColonize('ui/form/input');

// 'Ui::Form::Input'
```

:::


### pascalize {#api-pascalize}

Converts an entity name to Pascal case. Used for naming the class that is associated with the entity.

::: code-group

```ts [Signature]
/**
 * @param entityName
 *
 * The name of an entity (made up of lowercase letters, hyphen,
 * and forward slash).
 *
 * @return
 *
 * The name in Pascal case.
 */
function pascalize(entityName: string): string;
```

```ts [Example]
import { pascalize } from '@codemod-utils/ember';

const newValue = pascalize('ui/form/input');

// 'UiFormInput'
```

:::
