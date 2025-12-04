import { assert, createFile, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { data, renameGetters } from '../helpers/update-javascript.js';

test('update-javascript > template-only (1)', function () {
  const oldFile = createFile([`<template></template>;`, ``]);

  const newFile = updateJavaScript(oldFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(newFile, createFile([`<template></template>`, ``]));

  const newFile2 = updateJavaScript(newFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(newFile2, newFile);
});
