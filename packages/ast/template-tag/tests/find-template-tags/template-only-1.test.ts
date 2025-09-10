import { assert, test } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';

test('find-template-tags > template-only (1)', function () {
  const oldFile = [`<template></template>;`, ``].join('\n');

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 10,
        endChar: 10,
        startByte: 10,
        startChar: 10,
      },
      contents: '',
      endRange: {
        endByte: 21,
        endChar: 21,
        startByte: 10,
        startChar: 10,
      },
      range: {
        endByte: 21,
        endChar: 21,
        startByte: 0,
        startChar: 0,
      },
      startRange: {
        endByte: 10,
        endChar: 10,
        startByte: 0,
        startChar: 0,
      },
      tagName: 'template',
      type: 'expression',
    },
  ]);
});
