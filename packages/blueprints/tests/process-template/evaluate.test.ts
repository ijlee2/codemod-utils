import { assert, createFile, test } from '@codemod-utils/tests';

import { processTemplate } from '../../src/index.js';

test('process-template > evaluate', function () {
  const blueprintFile = createFile([
    `<% if (options.packageManager.isNpm) { %>{`,
    `  "scripts": {`,
    `    "prepare": "npm run build",`,
    `  },`,
    `}<% } else if (options.packageManager.isPnpm) { %>{`,
    `  "scripts": {`,
    `    "prepare": "pnpm build",`,
    `  },`,
    `}<% } else if (options.packageManager.isYarn) { %>{`,
    `  "scripts": {`,
    `    "prepare": "yarn build",`,
    `  },`,
    `}<% } %>`,
  ]);

  const file = processTemplate(blueprintFile, {
    options: {
      packageManager: {
        isNpm: false,
        isPnpm: false,
        isYarn: true,
      },
    },
  });

  const expectedValue = createFile([
    `{`,
    `  "scripts": {`,
    `    "prepare": "yarn build",`,
    `  },`,
    `}`,
  ]);

  assert.strictEqual(file, expectedValue);
});
