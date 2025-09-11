import { assert, test } from '@codemod-utils/tests';

import { processTemplate } from '../../src/index.js';

test('process-template > interpolate', function () {
  const blueprintFile = [
    `packages:`,
    `  - '<%= options.packages.addon.name %>'`,
    `  - '<%= options.packages.testApp.name %>'`,
  ].join('\n');

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

  const expectedValue = [
    `packages:`,
    `  - 'ember-container-query'`,
    `  - 'test-app'`,
  ].join('\n');

  assert.strictEqual(file, expectedValue);
});
