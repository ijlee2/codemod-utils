import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { updateJavaScript } from '../../src/index.js';
import { data, renameGetters } from '../helpers/update-javascript.js';

test('update-javascript > template-only (1)', function () {
  const oldFile = normalizeFile([`<template></template>;`, ``]);

  const newFile = updateJavaScript(oldFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(newFile, normalizeFile([`<template></template>`, ``]));

  const newFile2 = updateJavaScript(newFile, (code) => {
    return renameGetters(code, data);
  });

  assert.strictEqual(newFile2, newFile);
});
