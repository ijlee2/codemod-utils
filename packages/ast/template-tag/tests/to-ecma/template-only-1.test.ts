import { assert, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > template-only (1)', function () {
  const oldFile = [`<template></template>;`, ``].join('\n');

  const newFile = toEcma(oldFile);

  assert.strictEqual(
    newFile,
    [
      `import { template as template_fd9b2463e5f141cfb5666b64daa1f11a } from "@ember/template-compiler";`,
      `export default template_fd9b2463e5f141cfb5666b64daa1f11a(\`\`, {`,
      `    eval () {`,
      `        return eval(arguments[0]);`,
      `    }`,
      `});;`,
      ``,
    ].join('\n'),
  );

  const newFile2 = toEcma(newFile);

  assert.strictEqual(newFile2, newFile);
});
