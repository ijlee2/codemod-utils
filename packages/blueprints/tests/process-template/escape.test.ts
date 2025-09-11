import { assert, test } from '@codemod-utils/tests';

import { processTemplate } from '../../src/index.js';

test('process-template > escape', function () {
  const blueprintFile = '<%- context.htmlCode %>';

  const file = processTemplate(blueprintFile, {
    context: {
      htmlCode: '<em>I 🧡 container queries!</em>',
    },
  });

  const expectedValue = '&lt;em&gt;I 🧡 container queries!&lt;/em&gt;';

  assert.strictEqual(file, expectedValue);
});
