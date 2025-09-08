import { assert, test } from '@codemod-utils/tests';

import { replaceTemplate } from '../../src/index.js';

test('replace-template > base case', function () {
  const oldFile = [`<template></template>;`, ``].join('\n');

  const newFile = replaceTemplate(oldFile, {
    range: {
      endByte: 21,
      endChar: 21,
      startByte: 0,
      startChar: 0,
    },
    template: 'New contents',
  });

  assert.strictEqual(
    newFile,
    [`<template>New contents</template>;`, ``].join('\n'),
  );
});
