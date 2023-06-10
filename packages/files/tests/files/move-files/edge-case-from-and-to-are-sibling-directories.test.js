import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { moveFiles } from '../../../src/index.js';
import { codemodOptions, options } from '../../shared-test-setups/index.js';

test('files | move-files > edge case (from and to are sibling directories)', function () {
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
    },
  };

  loadFixture(inputProject, codemodOptions);

  const filePaths = ['app/styles/app.css'];

  moveFiles(filePaths, {
    from: 'app/styles',
    projectRoot: options.projectRoot,
    to: 'app/assets',
  });

  assertFixture(outputProject, codemodOptions);
});
