import { assert, test } from '@codemod-utils/tests';

import { preprocess } from '../../src/index.js';

test('preprocess > base case', function () {
  const oldFile = [`<template></template>;`, ``].join('\n');

  const { javascript, templateTags } = preprocess(oldFile);

  assert.strictEqual(
    javascript,
    [
      `import { template as template_fd9b2463e5f141cfb5666b64daa1f11a } from "@ember/template-compiler";`,
      `export default template_fd9b2463e5f141cfb5666b64daa1f11a(\`\`, {`,
      `    eval () {`,
      `        return eval(arguments[0]);`,
      `    }`,
      `});`,
      ``,
    ].join('\n'),
  );

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
