import { assert, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { removeClassAttribute } from '../helpers/update-templates.js';

test('update-templates > template-only (1)', function () {
  const oldFile = [`<template></template>;`, ``].join('\n');

  const newFile = updateTemplates(oldFile, removeClassAttribute);

  assert.strictEqual(newFile, [`<template></template>;`, ``].join('\n'));
});
