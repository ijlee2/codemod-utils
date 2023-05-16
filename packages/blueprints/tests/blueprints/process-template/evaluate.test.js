import { assert, test } from '@codemod-utils/tests';

import { processTemplate } from '../../../src/index.js';

test('blueprints | process-template > evaluate', function () {
  const blueprintFile = [
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
  ].join('\n');

  const file = processTemplate(blueprintFile, {
    options: {
      packageManager: {
        isNpm: false,
        isPnpm: false,
        isYarn: true,
      },
    },
  });

  const expectedValue = [
    `{`,
    `  "scripts": {`,
    `    "prepare": "yarn build",`,
    `  },`,
    `}`,
  ].join('\n');

  assert.strictEqual(file, expectedValue);
});
