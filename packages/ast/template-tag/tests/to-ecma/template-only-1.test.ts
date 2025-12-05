import { assert, normalizeFile, test } from '@codemod-utils/tests';

import { toEcma } from '../../src/index.js';

test('to-ecma > template-only (1)', function () {
  const oldFile = normalizeFile([`<template></template>;`, ``]);

  const newFile = toEcma(oldFile);

  assert.strictEqual(
    newFile,
    normalizeFile([
      `import { template as template_fd9b2463e5f141cfb5666b64daa1f11a } from "@ember/template-compiler";`,
      `export default template_fd9b2463e5f141cfb5666b64daa1f11a(\`\`, {`,
      `    eval () {`,
      `        return eval(arguments[0]);`,
      `    }`,
      `});;`,
      ``,
    ]),
  );

  const newFile2 = toEcma(newFile);

  assert.strictEqual(newFile2, newFile);
});
