import { assert, test } from '@codemod-utils/tests';

import { convertToMap } from '../../../src/index.js';

test('json | convert-to-map > base case', function () {
  const devDependencies = {
    'ember-cli-babel': '^7.26.11',
    'ember-cli-htmlbars': '^6.1.1',
    'ember-cli-typescript': '^5.2.1',
    'ember-element-helper': '^0.6.1',
    'ember-modifier': '^3.2.7',
    'ember-resize-observer-service': '^1.1.0',
    'ember-test-selectors': '^6.0.0',
  };

  const expectedValue = new Map([
    ['ember-cli-babel', '^7.26.11'],
    ['ember-cli-htmlbars', '^6.1.1'],
    ['ember-cli-typescript', '^5.2.1'],
    ['ember-element-helper', '^0.6.1'],
    ['ember-modifier', '^3.2.7'],
    ['ember-resize-observer-service', '^1.1.0'],
    ['ember-test-selectors', '^6.0.0'],
  ]);

  assert.deepEqual(convertToMap(devDependencies), expectedValue);
});
