import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { copyFiles } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('copy-files > edge case (from and to are sibling directories)', function () {
  const inputProject = {
    app: {
      assets: {},
      styles: {
        'app.css': 'some code for app.css',
      },
    },
  };

  const outputProject = {
    app: {
      assets: {
        'app.css': 'some code for app.css',
      },
      styles: {
        'app.css': 'some code for app.css',
      },
    },
  };

  loadFixture(inputProject, codemodOptions);

  const filePathMap = new Map([['app/styles/app.css', 'app/assets/app.css']]);

  copyFiles(filePathMap, {
    projectRoot: options.projectRoot,
  });

  assertFixture(outputProject, codemodOptions);
});
