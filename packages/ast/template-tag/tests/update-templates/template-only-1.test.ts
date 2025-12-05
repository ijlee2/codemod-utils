import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { updateTemplates } from '../../src/index.js';
import { removeClassAttribute } from '../helpers/update-templates.js';

test('update-templates > template-only (1)', function () {
  const oldFile = normalizeFile([`<template></template>;`, ``]);

  const newFile = updateTemplates(oldFile, removeClassAttribute);

  assert.strictEqual(newFile, normalizeFile([`<template></template>;`, ``]));

  const newFile2 = updateTemplates(newFile, removeClassAttribute);

  assert.strictEqual(newFile2, newFile);
});
