import { assert, createFile, test } from '@codemod-utils/tests';

import { replaceTemplateTag } from '../../src/index.js';

test('replace-template-tag > template-only (1)', function () {
  const oldFile = createFile([`<template></template>;`, ``]);

  const newFile = replaceTemplateTag(oldFile, {
    code: '<template>New contents</template>',
    range: {
      endByte: 21,
      endChar: 21,
      startByte: 0,
      startChar: 0,
    },
  });

  assert.strictEqual(
    newFile,
    createFile([`<template>New contents</template>;`, ``]),
  );
});
