import { assertFixture, loadFixture, test } from '@codemod-utils/tests';

import { moveFiles } from '../../src/index.js';
import { codemodOptions, options } from '../shared-test-setups/index.js';

test('move-files > base case', function () {
  const inputProject = {
    addon: {
      components: {
        'container-query.hbs': 'some code for container-query.hbs',
        'container-query.ts': 'some code for container-query.ts',
      },
    },

    app: {
      components: {
        'container-query.js': 'some code for container-query.js',
      },
    },
  };

  const outputProject = {
    'ember-container-query': {
      src: {
        components: {
          'container-query.hbs': 'some code for container-query.hbs',
          'container-query.ts': 'some code for container-query.ts',
        },
      },
    },

    app: {
      components: {
        'container-query.js': 'some code for container-query.js',
      },
    },
  };

  loadFixture(inputProject, codemodOptions);

  const filePathMap = new Map([
    [
      'addon/components/container-query.hbs',
      'ember-container-query/src/components/container-query.hbs',
    ],
    [
      'addon/components/container-query.ts',
      'ember-container-query/src/components/container-query.ts',
    ],
  ]);

  moveFiles(filePathMap, {
    projectRoot: options.projectRoot,
  });

  assertFixture(outputProject, codemodOptions);
});
