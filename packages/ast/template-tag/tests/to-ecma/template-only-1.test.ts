import { assert, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > template-only (1)', function () {
  const oldFile = [`<template></template>;`, ``].join('\n');

  const newFile = toEcma(oldFile);

  assert.strictEqual(newFile, [`\`                   \`;`, ``].join('\n'));
});
