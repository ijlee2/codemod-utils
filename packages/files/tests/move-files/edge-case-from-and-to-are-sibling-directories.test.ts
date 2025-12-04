import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { moveFiles } from '../../src/index.js';
import { codemodOptions, options } from '../helpers/index.js';

test('move-files > edge case (from and to are sibling directories)', function () {
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

  const filePathMap = new Map([['app/styles/app.css', 'app/assets/app.css']]);

  moveFiles(filePathMap, {
    projectRoot: options.projectRoot,
  });

  assertFixture(outputProject, codemodOptions);
});
