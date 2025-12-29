import { assert, normalizeFile } from '@codemod-utils/tests';

import { findTemplateTags } from '../../src/index.js';
import { testOnPosix } from '../helpers/index.js';

testOnPosix('find-template-tags > template-only (1)', function () {
  const oldFile = normalizeFile([`<template></template>;`, ``]);

  const templateTags = findTemplateTags(oldFile);

  assert.deepStrictEqual(templateTags, [
    {
      contentRange: {
        endByte: 10,
        endChar: 10,
        endUtf16Codepoint: 10,
        startByte: 10,
        startChar: 10,
        startUtf16Codepoint: 10,
      },
      contents: '',
      endRange: {
        endByte: 21,
        endChar: 21,
        endUtf16Codepoint: 21,
        startByte: 10,
        startChar: 10,
        startUtf16Codepoint: 10,
      },
      range: {
        endByte: 21,
        endChar: 21,
        endUtf16Codepoint: 21,
        startByte: 0,
        startChar: 0,
        startUtf16Codepoint: 0,
      },
      startRange: {
        endByte: 10,
        endChar: 10,
        endUtf16Codepoint: 10,
        startByte: 0,
        startChar: 0,
        startUtf16Codepoint: 0,
      },
      tagName: 'template',
      type: 'expression',
    },
  ]);
});
