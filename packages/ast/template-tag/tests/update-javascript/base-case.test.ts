import { assert, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { data, renameGetters } from '../helpers/update-javascript.js';

test('update-javascript > base case', function () {
  const oldFile = [`<template></template>;`, ``].join('\n');

  const newFile = updateJavaScript(oldFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(newFile, [`<template></template>;`, ``].join('\n'));
});
