import { assert, createFile, test } from '@codemod-utils/tests';

import { processTemplate } from '../../src/index.js';

test('process-template > interpolate', function () {
  const blueprintFile = createFile([
    `packages:`,
    `  - '<%= options.packages.addon.name %>'`,
    `  - '<%= options.packages.testApp.name %>'`,
  ]);

  const file = processTemplate(blueprintFile, {
    options: {
      packages: {
        addon: {
          name: 'ember-container-query',
        },
        testApp: {
          name: 'test-app',
        },
      },
    },
  });

  const expectedValue = createFile([
    `packages:`,
    `  - 'ember-container-query'`,
    `  - 'test-app'`,
  ]);

  assert.strictEqual(file, expectedValue);
});
